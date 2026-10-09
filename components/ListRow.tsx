import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { DirectionalIcon } from './DirectionalIcon';
import { PressableScale } from './PressableScale';

export type ListRowProps = {
  title: string;
  subtitle?: string;
  /** Trailing muted text, e.g. a current setting value. */
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  destructive?: boolean;
};

export function ListRow({ title, subtitle, value, onPress, trailing, leading, destructive }: ListRowProps) {
  const { colors } = useTheme();
  const content = (
    <>
      {leading ? <View style={styles.leading}>{leading}</View> : null}
      <View style={styles.text}>
        <AppText variant="body" color={destructive ? colors.danger : undefined}>{title}</AppText>
        {subtitle ? <AppText variant="small" muted>{subtitle}</AppText> : null}
      </View>
      {value ? <AppText variant="small" muted style={styles.value}>{value}</AppText> : null}
      {trailing ? <View style={styles.trailing}>{trailing}</View> : onPress ? <DirectionalIcon icon={ChevronRight} /> : null}
    </>
  );
  const rowStyle = [styles.row, { borderBottomColor: colors.line }];
  if (!onPress) return <View style={rowStyle}>{content}</View>;
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={[title, subtitle, value].filter(Boolean).join(', ')} haptic={false} style={rowStyle}>
      {content}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: 56, flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  leading: { marginEnd: 14 },
  text: { flex: 1 },
  value: { marginStart: 12, flexShrink: 1 },
  trailing: { marginStart: 12 },
});
