import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { AppState, AuthData, UserProfile, DayProgress } from './types';
import { ThemeMode } from './theme';

const KEYS = {
  APP_STATE: 'nafs_app_state',
  AUTH: 'nafs_auth',
  USER_PROFILE: 'nafs_user_profile',
  LOGIN_ATTEMPTS: 'nafs_login_attempts',
  LOGIN_LOCKOUT: 'nafs_login_lockout',
  THEME_MODE: 'nafs_theme_mode',
  NOTIFICATION_SETTINGS: 'nafs_notification_settings',
};

const isWeb = Platform.OS === 'web';

const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        const value = window.localStorage.getItem(key);
        return value ? (JSON.parse(value) as T) : null;
      }
      const value = await AsyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
        return;
      }
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {
      // silently fail
    }
  },

  async remove(key: string): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        return;
      }
      await AsyncStorage.removeItem(key);
    } catch {
      // silently fail
    }
  },

  async clear(): Promise<void> {
    try {
      if (isWeb && typeof window !== 'undefined') {
        Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
        return;
      }
      for (const k of Object.values(KEYS)) {
        await AsyncStorage.removeItem(k);
      }
    } catch {
      // silently fail
    }
  },
};

const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      if (isWeb) {
        return window.localStorage.getItem(`secure_${key}`);
      }
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },

  async set(key: string, value: string): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage.setItem(`secure_${key}`, value);
        return;
      }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // silently fail
    }
  },

  async delete(key: string): Promise<void> {
    try {
      if (isWeb) {
        window.localStorage.removeItem(`secure_${key}`);
        return;
      }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // silently fail
    }
  },
};

export const appStorage = {
  async getState(): Promise<AppState | null> {
    return storage.get<AppState>(KEYS.APP_STATE);
  },

  async setState(state: AppState): Promise<void> {
    return storage.set(KEYS.APP_STATE, state);
  },

  async updateState(partial: Partial<AppState>): Promise<void> {
    const current = await appStorage.getState();
    if (current) {
      await storage.set(KEYS.APP_STATE, { ...current, ...partial });
    }
  },

  async getAuth(): Promise<AuthData | null> {
    const data = await secureStorage.get(KEYS.AUTH);
    return data ? (JSON.parse(data) as AuthData) : null;
  },

  async setAuth(auth: AuthData): Promise<void> {
    return secureStorage.set(KEYS.AUTH, JSON.stringify(auth));
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    return storage.set(KEYS.USER_PROFILE, profile);
  },

  async getProfile(): Promise<UserProfile | null> {
    return storage.get<UserProfile>(KEYS.USER_PROFILE);
  },

  async saveDayProgress(day: number, progress: DayProgress): Promise<void> {
    const state = await appStorage.getState();
    if (state) {
      const dayProgress = { ...state.dayProgress, [day]: progress };
      let streakDays = 0;

      for (let d = state.currentDay; d >= 1; d--) {
        if (dayProgress[d] && dayProgress[d].completedTaskIds.length > 0) {
          streakDays++;
        } else {
          break;
        }
      }

      await storage.set(KEYS.APP_STATE, {
        ...state,
        dayProgress,
        streakDays,
        lastActiveDate: new Date().toDateString(),
      });
    }
  },

  async resetAll(): Promise<void> {
    await storage.clear();
    await secureStorage.delete(KEYS.AUTH);
  },

  async initState(profile: UserProfile): Promise<AppState> {
    const state: AppState = {
      isOnboarded: true,
      isAuthenticated: false,
      userProfile: profile,
      currentDay: 1,
      dayProgress: {},
      totalPoints: 0,
      streakDays: 0,
      lastActiveDate: new Date().toDateString(),
    };
    await storage.set(KEYS.APP_STATE, state);
    return state;
  },

  // Login rate limiting
  async getLoginAttempts(): Promise<{ count: number; lockedUntil: string | null }> {
    const count = (await storage.get<number>(KEYS.LOGIN_ATTEMPTS)) ?? 0;
    const lockedUntil = await storage.get<string>(KEYS.LOGIN_LOCKOUT);
    return { count, lockedUntil };
  },

  async recordLoginAttempt(): Promise<{ count: number; lockedUntil: string | null }> {
    const current = await appStorage.getLoginAttempts();
    const newCount = current.count + 1;

    if (newCount >= 5) {
      const lockedUntil = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      await storage.set(KEYS.LOGIN_ATTEMPTS, 0);
      await storage.set(KEYS.LOGIN_LOCKOUT, lockedUntil);
      return { count: 0, lockedUntil };
    }

    await storage.set(KEYS.LOGIN_ATTEMPTS, newCount);
    return { count: newCount, lockedUntil: null };
  },

  async clearLoginAttempts(): Promise<void> {
    await storage.set(KEYS.LOGIN_ATTEMPTS, 0);
    await storage.set(KEYS.LOGIN_LOCKOUT, null);
  },

  // Data export/import
  async exportData(): Promise<string> {
    const state = await appStorage.getState();
    const auth = await appStorage.getAuth();
    return JSON.stringify({ state, auth, exportedAt: new Date().toISOString(), version: 1 });
  },

  async importData(json: string): Promise<boolean> {
    try {
      const data = JSON.parse(json);
      if (data.state) {
        await storage.set(KEYS.APP_STATE, data.state);
      }
      if (data.auth) {
        await secureStorage.set(KEYS.AUTH, JSON.stringify(data.auth));
      }
      return true;
    } catch {
      return false;
    }
  },

  // Theme
  async getThemeMode(): Promise<ThemeMode | null> {
    return storage.get<ThemeMode>(KEYS.THEME_MODE);
  },

  async setThemeMode(mode: ThemeMode): Promise<void> {
    return storage.set(KEYS.THEME_MODE, mode);
  },

  // Notification settings
  async getNotificationSettings(): Promise<NotificationSettings | null> {
    return storage.get<NotificationSettings>(KEYS.NOTIFICATION_SETTINGS);
  },

  async setNotificationSettings(settings: NotificationSettings): Promise<void> {
    return storage.set(KEYS.NOTIFICATION_SETTINGS, settings);
  },
};

export interface NotificationSettings {
  dailyReminder: boolean;
  reminderTime: string;
  prayerReminders: boolean;
  streakReminder: boolean;
}

