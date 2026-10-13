import { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert, Linking, Platform, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { appStorage, DEFAULT_NOTIFICATION_SETTINGS, NotificationSettings } from '@/lib/storage';
import { requestNotificationPermission, syncNotifications } from '@/lib/notifications';
import { useTheme } from '@/lib/theme';
import { Moon, Sun, Bell, Download, Upload, Shield, FileText, Circle as HelpCircle, Info, ChevronRight, Trophy, BookOpen } from 'lucide-react-native';

const REMINDER_TIMES: { value: string; label: string }[] = [
  { value: '05:00', label: '5:00 AM' },
  { value: '06:00', label: '6:00 AM' },
  { value: '08:00', label: '8:00 AM' },
  { value: '12:30', label: '12:30 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '21:00', label: '9:00 PM' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, mode, toggleTheme } = useTheme();
  const [notifSettings, setNotifSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);

  useEffect(() => {
    (async () => {
      const saved = await appStorage.getNotificationSettings();
      if (saved) setNotifSettings(saved);
    })();
  }, []);

  const updateNotif = async (key: keyof NotificationSettings, value: boolean | string) => {
    if (value === true && Platform.OS !== 'web') {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(
          'Notifications are off',
          'Allow notifications for Nafs in your device settings to receive reminders.',
          [{ text: 'Not now', style: 'cancel' }, { text: 'Open settings', onPress: () => Linking.openSettings() }],
        );
        return;
      }
    }
    const updated = { ...notifSettings, [key]: value };
    setNotifSettings(updated);
    await appStorage.setNotificationSettings(updated);
    await syncNotifications();
  };

  const handleExport = async () => {
    try {
      const data = await appStorage.exportData();
      if (Platform.OS !== 'web') {
        await Share.share({ title: 'Nafs Backup', message: data });
      } else if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: 'Nafs Backup', text: data });
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(data);
      }
    } catch {
      // fallback - copy to clipboard
    }
  };

  const handleImport = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        const success = await appStorage.importData(text);
        if (!success) {
          // show error
        }
      }
    } catch {
      // clipboard not available
    }
  };

  const s = makeStyles(colors);

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Settings', headerStyle: { backgroundColor: colors.cream }, headerTintColor: colors.primaryGreen }} />
      <SafeAreaView style={[s.container, { backgroundColor: colors.cream }]}>
        <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Appearance</Text>
            <View style={s.card}>
              <View style={s.row}>
                {mode === 'dark' ? <Moon size={20} color={colors.gold} /> : <Sun size={20} color={colors.gold} />}
                <Text style={s.rowLabel}>Dark Mode</Text>
                <Switch
                  value={mode === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.border, true: colors.mediumGreen }}
                  thumbColor={colors.white}
                  accessibilityLabel="Toggle dark mode"
                />
              </View>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Notifications</Text>
            <View style={s.card}>
              <View style={s.row}>
                <Bell size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Daily Reminder</Text>
                <Switch
                  value={notifSettings.dailyReminder}
                  onValueChange={(v) => updateNotif('dailyReminder', v)}
                  trackColor={{ false: colors.border, true: colors.mediumGreen }}
                  thumbColor={colors.white}
                  accessibilityLabel="Toggle daily reminder"
                />
              </View>
              {notifSettings.dailyReminder && (
                <View style={s.timeRow}>
                  {REMINDER_TIMES.map((t) => {
                    const active = notifSettings.reminderTime === t.value;
                    return (
                      <TouchableOpacity
                        key={t.value}
                        style={[s.timeChip, active && s.timeChipActive]}
                        onPress={() => updateNotif('reminderTime', t.value)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={`Remind me at ${t.label}`}
                      >
                        <Text style={[s.timeChipText, active && s.timeChipTextActive]}>{t.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <View style={s.row}>
                <Bell size={20} color={colors.gold} />
                <Text style={s.rowLabel}>Streak Reminder</Text>
                <Switch
                  value={notifSettings.streakReminder}
                  onValueChange={(v) => updateNotif('streakReminder', v)}
                  trackColor={{ false: colors.border, true: colors.mediumGreen }}
                  thumbColor={colors.white}
                  accessibilityLabel="Toggle streak reminder"
                />
              </View>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Data</Text>
            <View style={s.card}>
              <TouchableOpacity style={s.row} onPress={handleExport} accessibilityLabel="Export your data">
                <Download size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Export Data</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={handleImport} accessibilityLabel="Import data from backup">
                <Upload size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Import Data</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Legal</Text>
            <View style={s.card}>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/privacy')} accessibilityLabel="View privacy policy">
                <Shield size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Privacy Policy</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/terms')} accessibilityLabel="View terms of service">
                <FileText size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Terms of Service</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>Support</Text>
            <View style={s.card}>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/achievements')} accessibilityLabel="View achievements">
                <Trophy size={20} color={colors.gold} />
                <Text style={s.rowLabel}>Achievements</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/duas')} accessibilityLabel="Browse duas library">
                <BookOpen size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Duas Library</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/help')} accessibilityLabel="View help and FAQ">
                <HelpCircle size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>Help & FAQ</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
              <TouchableOpacity style={s.row} onPress={() => router.push('/(modals)/about')} accessibilityLabel="About this app">
                <Info size={20} color={colors.mediumGreen} />
                <Text style={s.rowLabel}>About Nafs</Text>
                <ChevronRight size={18} color={colors.mutedText} />
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const makeStyles = (c: typeof import('@/lib/theme').lightTheme) =>
  StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 16, paddingVertical: 16 },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 14, fontWeight: '600', color: c.mutedText, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    card: { backgroundColor: c.cardBackground, borderRadius: 12, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14, gap: 12, borderBottomColor: c.border, borderBottomWidth: 1 },
    timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 14, paddingBottom: 14, borderBottomColor: c.border, borderBottomWidth: 1 },
    timeChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1, borderColor: c.border },
    timeChipActive: { backgroundColor: c.mediumGreen, borderColor: c.mediumGreen },
    timeChipText: { fontSize: 13, fontWeight: '500', color: c.mutedText },
    timeChipTextActive: { color: '#FFFFFF' },
    rowLabel: { flex: 1, fontSize: 14, fontWeight: '500', color: c.darkText },
  });
