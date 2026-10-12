import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { BookOpen, CircleUser, HandHeart, Route, Sunrise } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';

const withAlpha = (hex: string, alpha: number) => {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = (i: number) => parseInt(full.slice(i, i + 2), 16);
  return `rgba(${n(0)},${n(2)},${n(4)},${alpha})`;
};

const icon = (Icon: typeof Sunrise) =>
  function TabIcon({ color, focused }: { color: string; focused: boolean }) {
    return <Icon size={24} color={color} strokeWidth={focused ? 2.5 : 2} />;
  };

const TodayIcon = icon(Sunrise);
const WorshipIcon = icon(HandHeart);
const LearnIcon = icon(BookOpen);
const JourneyIcon = icon(Route);
const MeIcon = icon(CircleUser);

export default function TabLayout() {
  const { colors, scheme, font } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Hidden tabs skip re-rendering while another tab updates the store (e.g. tasbih taps).
        freezeOnBlur: true,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontFamily: font('uiMedium'), fontSize: 11, lineHeight: 16 },
        tabBarItemStyle: { paddingVertical: 4 },
        tabBarBackground: () => (
          <View style={styles.clip}>
            {Platform.OS === 'ios' ? (
              <BlurView intensity={30} tint={scheme === 'dark' ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
            ) : null}
          </View>
        ),
        tabBarStyle: {
          position: 'absolute',
          start: 16,
          end: 16,
          bottom: insets.bottom + 8,
          height: 68,
          borderRadius: 22,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.line,
          backgroundColor: withAlpha(colors.surface, Platform.OS === 'ios' ? 0.92 : 1),
          shadowColor: colors.shadow,
          shadowOpacity: 0.1,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('tabs.today'), tabBarIcon: TodayIcon }} />
      <Tabs.Screen name="worship" options={{ title: t('tabs.worship'), tabBarIcon: WorshipIcon }} />
      <Tabs.Screen name="learn" options={{ title: t('tabs.learn'), tabBarIcon: LearnIcon }} />
      <Tabs.Screen name="journey" options={{ title: t('tabs.journey'), tabBarIcon: JourneyIcon }} />
      <Tabs.Screen name="me" options={{ title: t('tabs.me'), tabBarIcon: MeIcon }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({ clip: { ...StyleSheet.absoluteFillObject, borderRadius: 22, overflow: 'hidden' } });
