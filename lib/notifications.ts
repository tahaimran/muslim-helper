import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { appStorage, DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings } from './storage';
import { getDayPlan } from './planGenerator';

const CHANNEL_ID = 'daily-reminders';
const DAYS_AHEAD = 7;
const STREAK_HOUR = 20;
const STREAK_MINUTE = 30;
const isNative = Platform.OS !== 'web';

/** Call once at startup so notifications show while the app is open. */
export function configureNotifications(): void {
  if (!isNative) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

async function ensureChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

export async function hasNotificationPermission(): Promise<boolean> {
  if (!isNative) return false;
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

/** Asks for permission if it hasn't been decided yet. Returns whether it is granted. */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative) return false;
  try {
    // Android 13+ needs the channel to exist before the permission prompt appears.
    await ensureChannel();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const { granted } = await Notifications.requestPermissionsAsync();
    return granted;
  } catch {
    return false;
  }
}

function parseTime(value: string): { hour: number; minute: number } {
  const [h, m] = value.split(':').map((n) => parseInt(n, 10));
  return {
    hour: Number.isFinite(h) ? Math.min(Math.max(h, 0), 23) : 6,
    minute: Number.isFinite(m) ? Math.min(Math.max(m, 0), 59) : 0,
  };
}

function atTime(base: Date, hour: number, minute: number): Date {
  const d = new Date(base);
  d.setHours(hour, minute, 0, 0);
  return d;
}

/**
 * Rebuilds every scheduled reminder from the saved settings and progress.
 * Safe to call as often as needed (app start, foreground, task changes, settings changes).
 *
 * - Daily reminder: one notification per day for the next week, each naming that day's theme.
 * - Streak reminder: a single evening nudge, only while today still has no completed task.
 *   It is rescheduled on every sync, so finishing a task today moves it to tomorrow.
 */
export async function syncNotifications(): Promise<void> {
  if (!isNative) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!(await hasNotificationPermission())) return;
    await ensureChannel();

    const settings: NotificationSettings =
      (await appStorage.getNotificationSettings()) ?? DEFAULT_NOTIFICATION_SETTINGS;
    const state = await appStorage.getState();
    if (!state?.isOnboarded) return;

    const now = new Date();
    const doneToday = (state.dayProgress[state.currentDay]?.completedTaskIds.length ?? 0) > 0;

    if (settings.dailyReminder) {
      const { hour, minute } = parseTime(settings.reminderTime);
      for (let i = 0; i < DAYS_AHEAD; i++) {
        const dayNumber = state.currentDay + i;
        if (dayNumber > 30) break;
        const when = atTime(new Date(now.getTime() + i * 86_400_000), hour, minute);
        if (when.getTime() <= now.getTime()) continue;
        const plan = getDayPlan(dayNumber);
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Day ${dayNumber}: ${plan.theme}`,
            body: 'Your plan for today is ready. A few mindful minutes is enough.',
          },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: CHANNEL_ID },
        });
      }
    }

    if (settings.streakReminder && state.currentDay <= 30) {
      let when = atTime(now, STREAK_HOUR, STREAK_MINUTE);
      if (doneToday || when.getTime() <= now.getTime()) {
        when = atTime(new Date(now.getTime() + 86_400_000), STREAK_HOUR, STREAK_MINUTE);
      }
      const streak = state.streakDays;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: streak > 1 ? `Keep your ${streak}-day streak alive` : 'Your journey is waiting',
          body: 'Complete one task today to keep your momentum going.',
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: CHANNEL_ID },
      });
    }
  } catch {
    // Reminders are best-effort; never let scheduling break the app.
  }
}
