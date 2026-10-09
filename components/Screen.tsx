import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  edges?: Edge[];
  contentStyle?: ViewStyle;
};

export function Screen({ children, scroll = true, padded = true, edges = ['top'], contentStyle }: ScreenProps) {
  const { colors } = useTheme();
  const pad: ViewStyle = padded ? { paddingHorizontal: 20 } : {};
  return (
    <SafeAreaView edges={edges} style={[styles.fill, { backgroundColor: colors.bg }]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[pad, { paddingBottom: 120, paddingTop: 8 }, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, pad, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ fill: { flex: 1 } });
