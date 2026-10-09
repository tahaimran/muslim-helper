import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TYPE_SCALE } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';

export function ThreadList({ children }: { children: React.ReactNode }) {
  return <View>{children}</View>;
}

const NODE_COL = 44;

/**
 * A 44-wide node column with a hairline through the node centre, content beside it.
 * The content is padded so the first text line is centred on the node; `first`/`last`
 * stop the line running above the first node or below the last.
 */
export function ThreadItem({
  node, children, first, last,
}: { node: React.ReactNode; children: React.ReactNode; first?: boolean; last?: boolean }) {
  const { colors, lineHeight } = useTheme();
  const padTop = Math.max(8, NODE_COL / 2 - lineHeight(TYPE_SCALE.body) / 2);
  const lineEnd = last ? { height: first ? 0 : NODE_COL / 2 } : { bottom: 0 };
  return (
    <View style={styles.row}>
      <View style={styles.nodeCol}>
        <View style={[styles.line, { backgroundColor: colors.line, top: first ? NODE_COL / 2 : 0 }, lineEnd]} />
        <View style={styles.node}>{node}</View>
      </View>
      <View style={[styles.content, { paddingTop: padTop }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', minHeight: 56 },
  nodeCol: { width: NODE_COL, alignItems: 'center', alignSelf: 'stretch' },
  line: { position: 'absolute', top: 0, width: 1, start: NODE_COL / 2 - 0.5 },
  node: { height: NODE_COL, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, minHeight: NODE_COL, paddingBottom: 8, paddingStart: 8 },
});
