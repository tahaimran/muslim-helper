import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';
import { Chip } from '../Chip';
import { PressableScale } from '../PressableScale';
import { SUPPORTED_LANGS } from '../../lib/i18n';
import { IMPROVEMENT_AREAS, KNOWLEDGE_LEVELS, PRACTICE_LEVELS, type Lang } from '../../lib/model';
import { MINUTE_OPTIONS } from '../../lib/onboarding';
import type { ImprovementArea, KnowledgeLevel, PracticeLevel } from '../../lib/types';

/** Language names are shown in their own language so anyone can find theirs. */
export const LANGUAGE_NAMES: Record<Lang, string> = {
  en: 'English',
  ar: 'العربية',
  ur: 'اردو',
  id: 'Bahasa Indonesia',
  tr: 'Türkçe',
};

export function OptionRow({
  title, subtitle, selected, onPress,
}: { title: string; subtitle?: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={[title, subtitle].filter(Boolean).join(', ')}
      accessibilityState={{ selected, checked: selected }}
      style={[
        styles.option,
        { borderColor: selected ? colors.accent : colors.line, backgroundColor: selected ? colors.surface : 'transparent' },
      ]}
    >
      <View style={styles.optionText}>
        <AppText variant="body" weight="medium">{title}</AppText>
        {subtitle ? <AppText variant="small" muted>{subtitle}</AppText> : null}
      </View>
      {selected ? <Check size={20} color={colors.accent} /> : null}
    </PressableScale>
  );
}

export function LanguageOptions({ value, onChange }: { value: Lang; onChange: (l: Lang) => void }) {
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {SUPPORTED_LANGS.map((l) => (
        <OptionRow key={l} title={LANGUAGE_NAMES[l]} selected={value === l} onPress={() => onChange(l)} />
      ))}
    </View>
  );
}

export function NameInput({ value, onChange, autoFocus }: { value: string; onChange: (v: string) => void; autoFocus?: boolean }) {
  const { t } = useTranslation();
  const { colors, font } = useTheme();
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      placeholder={t('profile.namePlaceholder')}
      placeholderTextColor={colors.textMuted}
      accessibilityLabel={t('profile.name')}
      autoFocus={autoFocus}
      autoCapitalize="words"
      autoCorrect={false}
      maxLength={40}
      returnKeyType="done"
      style={[styles.input, { color: colors.text, borderColor: colors.line, backgroundColor: colors.surface, fontFamily: font('ui') }]}
    />
  );
}

export function HabitOptions({ value, onChange }: { value: PracticeLevel | null; onChange: (v: PracticeLevel) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {PRACTICE_LEVELS.map((p) => (
        <OptionRow key={p} title={t(`profile.habit.${p}`)} selected={value === p} onPress={() => onChange(p)} />
      ))}
    </View>
  );
}

export function KnowledgeOptions({ value, onChange }: { value: KnowledgeLevel | null; onChange: (v: KnowledgeLevel) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {KNOWLEDGE_LEVELS.map((k) => (
        <OptionRow key={k} title={t(`profile.knowledge.${k}`)} subtitle={t(`profile.knowledgeDesc.${k}`)} selected={value === k} onPress={() => onChange(k)} />
      ))}
    </View>
  );
}

export function FocusChips({ value, onToggle }: { value: readonly ImprovementArea[]; onToggle: (a: ImprovementArea) => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.chips}>
      {IMPROVEMENT_AREAS.map((a) => (
        <Chip key={a} label={t(`profile.area.${a}`)} selected={value.includes(a)} onPress={() => onToggle(a)} />
      ))}
    </View>
  );
}

export function MinutesOptions({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  const { t } = useTranslation();
  const options = value !== null && !MINUTE_OPTIONS.includes(value)
    ? [...MINUTE_OPTIONS, value].sort((a, b) => a - b)
    : MINUTE_OPTIONS;
  return (
    <View style={styles.stack} accessibilityRole="radiogroup">
      {options.map((m) => (
        <OptionRow key={m} title={t('profile.minutes', { count: m })} selected={value === m} onPress={() => onChange(m)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: 10 },
  option: {
    minHeight: 60, borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center',
  },
  optionText: { flex: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  input: { minHeight: 52, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, fontSize: 17 },
});
