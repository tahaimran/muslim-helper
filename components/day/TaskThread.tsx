import React from 'react';
import { StyleSheet } from 'react-native';
import type { TaskVM } from '../../lib/view/today';
import { AppText } from '../AppText';
import { CheckNode } from '../CheckNode';
import { PressableScale } from '../PressableScale';
import { ThreadItem, ThreadList } from '../ThreadList';

export type TaskThreadProps = {
  tasks: TaskVM[];
  editable: boolean;
  onToggle: (id: string) => void;
  onLockedPress: () => void;
  categoryLabel: (c: TaskVM['category']) => string;
  labels: { a11yDone: string };
};

/** The day's steps as a vertical thread of check nodes. */
export function TaskThread({ tasks, editable, onToggle, onLockedPress, categoryLabel, labels }: TaskThreadProps) {
  return (
    <ThreadList>
      {tasks.map((task, i) => {
        const press = () => {
          if (!editable) return;
          if (task.lockedByTasbih) onLockedPress();
          else onToggle(task.id);
        };
        const category = categoryLabel(task.category);
        const base = `${task.title}, ${category}`;
        const a11y = task.done ? `${base}, ${labels.a11yDone}` : base;
        return (
          <ThreadItem
            key={task.id}
            first={i === 0}
            last={i === tasks.length - 1}
            node={<CheckNode checked={task.done} onPress={editable ? press : undefined} label={a11y} />}
          >
            <PressableScale
              onPress={press}
              disabled={!editable}
              haptic={false}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              style={styles.text}
            >
              <AppText variant="body" muted={task.done}>{task.title}</AppText>
              <AppText variant="caption" muted>{category}</AppText>
            </PressableScale>
          </ThreadItem>
        );
      })}
    </ThreadList>
  );
}

const styles = StyleSheet.create({
  text: { minHeight: 44, gap: 2 },
});
