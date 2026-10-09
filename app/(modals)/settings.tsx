import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText, Button, Chip, LanguageOptions, ListRow, Screen, Section } from '@/components';
import { OptionRow } from '@/components/profile/ProfileControls';
import { CityPicker } from '@/components/settings/CityPicker';
import { useAppStore } from '@/lib/store';
import { useLang } from '@/theme/useLang';
import { CALC_METHODS, type CalcMethodId, type MadhabId, type Settings } from '@/lib/model';
import { useLocationSetup } from '@/lib/useLocationSetup';
import { usePrayerTimes } from '@/lib/usePrayerTimes';
import { useToday } from '@/lib/useToday';

const THEMES: Settings['theme'][] = ['system', 'light', 'dark'];
const CONFIRM_WINDOW_MS = 4000;

export default function SettingsScreen() {
  const { t } = useTranslation();
  const lang = useLang();
  const theme = useAppStore((s) => s.settings.theme);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetAll = useAppStore((s) => s.resetAll);
  const location = useAppStore((s) => s.settings.location);
  const calcMethod = useAppStore((s) => s.settings.calcMethod);
  const madhabPref = useAppStore((s) => s.settings.madhab);
  const today = useToday();
  const { method, madhab } = usePrayerTimes(today);
  const { busy, error, fromGps, chooseCity } = useLocationSetup();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const methodName = (id: CalcMethodId) => t(`methods.${id}`);
  const asrName = (id: MadhabId) => t(id === 'hanafi' ? 'settings.asrHanafi' : 'settings.asrShafi');

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
    // The app shell redirects to onboarding once the profile is null.
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

      <Section title={t('settings.prayerTimes')} subtitle={t('settings.prayerTimesNote')}>
        <ListRow title={t('settings.location')} value={location?.label ?? t('location.notSet')} />
        <View style={styles.actions}>
          <Button variant="secondary" label={busy ? t('location.locating') : t('location.useMyLocation')} onPress={() => { fromGps(); }} loading={busy} />
          <Button variant="secondary" label={t('location.chooseCity')} onPress={() => setPickerOpen(true)} />
        </View>
        {error ? <AppText variant="small" muted accessibilityLiveRegion="polite">{t(`location.${error}`)}</AppText> : null}

        <ListRow
          title={t('settings.method')}
          value={calcMethod ? methodName(calcMethod) : t('settings.methodAuto', { method: methodName(method) })}
          onPress={() => setMethodOpen((o) => !o)}
        />
        {methodOpen ? (
          <View style={styles.options} accessibilityRole="radiogroup">
            <OptionRow
              title={t('settings.methodAuto', { method: methodName(method) })}
              selected={calcMethod === null}
              onPress={() => updateSettings({ calcMethod: null })}
            />
            {CALC_METHODS.map((id) => (
              <OptionRow key={id} title={methodName(id)} selected={calcMethod === id} onPress={() => updateSettings({ calcMethod: id })} />
            ))}
          </View>
        ) : null}

        <AppText variant="small" weight="medium" style={styles.asrTitle}>{t('settings.asr')}</AppText>
        <View style={styles.options} accessibilityRole="radiogroup">
          <OptionRow title={t('settings.asrAuto', { asr: asrName(madhab) })} selected={madhabPref === null} onPress={() => updateSettings({ madhab: null })} />
          <OptionRow title={t('settings.asrShafi')} selected={madhabPref === 'shafi'} onPress={() => updateSettings({ madhab: 'shafi' })} />
          <OptionRow title={t('settings.asrHanafi')} selected={madhabPref === 'hanafi'} onPress={() => updateSettings({ madhab: 'hanafi' })} />
        </View>
      </Section>

      <CityPicker
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(city) => { chooseCity(city); setPickerOpen(false); }}
      />

      <Section title={t('settings.data')}>
        <ListRow
          destructive
          title={confirming ? t('settings.resetConfirm') : t('settings.reset')}
          subtitle={confirming ? t('settings.resetConfirmHint') : t('settings.resetHint')}
          onPress={onReset}
          accessibilityHint={t('settings.resetA11yHint')}
          accessibilityLiveRegion="polite"
        />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actions: { marginTop: 8, marginBottom: 8, gap: 4 },
  options: { gap: 10, marginTop: 8 },
  asrTitle: { marginTop: 20 },
});
