import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import { AppText } from '../AppText';

export type ReflectionBoxProps = {
  question: string;
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  savedLabel: string;
};

const DEBOUNCE_MS = 600;

/** A quiet journal field: commits 600ms after typing stops and on blur, then shows a small "Saved". */
export function ReflectionBox({ question, value, onChange, placeholder, savedLabel }: ReflectionBoxProps) {
  const { colors, font, lineHeight } = useTheme();
  const [text, setText] = useState(value);
  const [saved, setSaved] = useState(false);
  const committed = useRef(value);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Follow external changes (e.g. a different day) when nothing is pending locally.
  useEffect(() => {
    if (timer.current === null && value !== committed.current) {
      committed.current = value;
      setText(value);
      setSaved(false);
    }
  }, [value]);

  const commit = (next: string) => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (next === committed.current) return;
    committed.current = next;
    onChangeRef.current(next);
    setSaved(true);
  };

  // Flush a pending edit if the screen unmounts mid-typing.
  const latest = useRef(text);
  latest.current = text;
  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
        timer.current = null;
        if (latest.current !== committed.current) onChangeRef.current(latest.current);
      }
    },
    [],
  );

  const onChangeText = (next: string) => {
    setText(next);
    setSaved(false);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next), DEBOUNCE_MS);
  };

  return (
    <View style={styles.wrap}>
      <AppText variant="body">{question}</AppText>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        onBlur={() => commit(text)}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={question}
        multiline
        textAlignVertical="top"
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.line,
            color: colors.text,
            fontFamily: font('ui'),
            lineHeight: lineHeight(16),
          },
        ]}
      />
      <AppText variant="caption" muted style={[styles.saved, { opacity: saved ? 1 : 0 }]} accessibilityLiveRegion="polite">
        {saved ? savedLabel : ' '}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  input: {
    minHeight: 120, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16, paddingVertical: 14, fontSize: 16,
  },
  saved: { alignSelf: 'flex-end' },
});
