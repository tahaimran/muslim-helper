import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Chip, LanguageOptions, ListRow, Screen, Section } from '@/components';
import { useAppStore } from '@/lib/store';
import { useLang } from '@/theme/useLang';
import type { Settings } from '@/lib/model';

const THEMES: Settings['theme'][] = ['system', 'light', 'dark'];
const CONFIRM_WINDOW_MS = 4000;

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lang = useLang();
  const theme = useAppStore((s) => s.settings.theme);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetAll = useAppStore((s) => s.resetAll);

  const [confirming, setConfirming] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const onReset = () => {
    if (!confirming) {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), CONFIRM_WINDOW_MS);
      return;
    }
    if (timer.current) clearTimeout(timer.current);
    setConfirming(false);
    resetAll();
    router.replace('/(onboarding)');
  };

  return (
    <Screen edges={['bottom']}>
      <Section title={t('settings.language')} subtitle={t('settings.languageNote')}>
        <LanguageOptions value={lang} onChange={(l) => updateSettings({ language: l })} />
      </Section>

      <Section title={t('settings.theme')}>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {THEMES.map((th) => (
            <Chip key={th} label={t(`settings.themes.${th}`)} selected={theme === th} onPress={() => updateSettings({ theme: th })} />
          ))}
        </View>
      </Section>

      <Section title={t('settings.data')}>
        <ListRow
          destructive
          title={confirming ? t('settings.resetConfirm') : t('settings.reset')}
          subtitle={confirming ? t('settings.resetConfirmHint') : t('settings.resetHint')}
          onPress={onReset}
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
