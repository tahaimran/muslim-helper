import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function ThreadList({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

const NODE_COL = 44;

/** A 44-wide node column with a hairline through the node centre, content beside it. */
export function ThreadItem({ node, children, last }: { node: React.ReactNode; children: React.ReactNode; last?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <View style={styles.nodeCol}>
        <View style={[styles.line, { backgroundColor: colors.line }, last ? { height: NODE_COL / 2 } : { bottom: 0 }]} />
        <View style={styles.node}>{node}</View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', minHeight: 56 },
  nodeCol: { width: NODE_COL, alignItems: 'center' },
  line: { position: 'absolute', top: 0, width: 1, start: NODE_COL / 2 - 0.5 },
  node: { height: NODE_COL, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingVertical: 8, paddingStart: 8 },
});
