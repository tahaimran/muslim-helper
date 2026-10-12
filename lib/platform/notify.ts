import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import i18n from '../i18n';
import { showToast } from '../../components/Toast';
import { appStore } from '../store';
import { planNotifications, type PlannedNotification } from '../notifications';
import { getPrayerTimes, resolveCalcSettings } from '../prayerTimes';

const CHANNEL_ID = 'reminders';
let configured = false;

/** Local notifications need a native runtime; on web the APIs are missing or inert. */
export function notificationsSupported(): boolean {
  return Platform.OS === 'ios' || Platform.OS === 'android';
}

async function configure(): Promise<void> {
  if (configured) return;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: i18n.t('reminders.channel'),
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  configured = true;
}

/** Asks for notification permission if needed. Never throws; false when unavailable or denied. */
export async function ensurePermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  try {
    await configure();
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const asked = await Notifications.requestPermissionsAsync();
    return asked.granted;
  } catch {
    return false;
  }
}

/** Replaces every scheduled notification with the given plan. */
export async function applyNotifications(planned: PlannedNotification[]): Promise<void> {
  if (!notificationsSupported()) return;
  await configure();
  await Notifications.cancelAllScheduledNotificationsAsync();
  const channelId = Platform.OS === 'android' ? CHANNEL_ID : undefined;
  for (const n of planned) {
    const content = { title: n.title, body: n.body };
    if (n.kind === 'daily') {
      await Notifications.scheduleNotificationAsync({
        identifier: n.id,
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: n.hour ?? 20,
          minute: n.minute ?? 0,
          channelId,
        },
      });
    } else if (n.at) {
      await Notifications.scheduleNotificationAsync({
        identifier: n.id,
        content,
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: n.at, channelId },
      });
    }
  }
}

/**
 * If a reminder is on but the system permission was revoked, switch reminders off and say so.
 * Returns true when it paused them (the settings change triggers its own reschedule).
 */
export async function pauseIfPermissionRevoked(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  const before = appStore.getState().settings.reminders;
  if (!before.daily && !before.prayers) return false;
  try {
    const perm = await Notifications.getPermissionsAsync();
    if (perm.granted) return false;
  } catch {
    return false;
  }
  // Re-read after the await: settings may have changed meanwhile (e.g. a new reminder time).
  const { settings, updateSettings } = appStore.getState();
  const r = settings.reminders;
  if (!r.daily && !r.prayers) return false;
  updateSettings({ reminders: { ...r, daily: false, prayers: false } });
  showToast(i18n.t('reminders.revoked'), 'info');
  return true;
}

let chain: Promise<void> = Promise.resolve();

async function run(): Promise<void> {
  if (!notificationsSupported()) return;
  const { settings } = appStore.getState();
  const { reminders, location } = settings;
  if (!reminders.daily && !reminders.prayers) {
    // Both off: clear anything left over from earlier.
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
      // nothing to cancel
    }
    return;
  }
  const t = i18n.t.bind(i18n);
  const { method, madhab } = resolveCalcSettings(
    { calcMethod: settings.calcMethod, madhab: settings.madhab },
    location?.countryCode ?? null,
  );
  const planned = planNotifications({
    now: new Date(),
    reminders,
    timesFor: location ? (d) => getPrayerTimes(d, location, method, madhab) : null,
    text: {
      dailyTitle: t('reminders.dailyTitle'),
      dailyBody: t('reminders.dailyBody'),
      prayerTitle: (p) => t('reminders.prayerTitle', { prayer: t(`prayers.${p}`) }),
      prayerBody: (p) => t('reminders.prayerBody', { prayer: t(`prayers.${p}`) }),
    },
  });
  await applyNotifications(planned);
}

/** Re-plans from the store. Serialized, never throws; no-op on unsupported platforms. */
export function rescheduleFromStore(): Promise<void> {
  chain = chain.then(run).catch(() => {});
  return chain;
}
