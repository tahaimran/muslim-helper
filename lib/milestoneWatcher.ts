import { showToast } from '../components/Toast';
import { MILESTONE_CONTENT } from '../content/milestones';
import { toDateKey } from './day';
import i18n from './i18n';
import { evaluateMilestones } from './milestones';
import { appStore, getPersisted } from './store';

/** Unlocks newly earned milestones whenever the store changes. Returns unsubscribe. */
export function startMilestoneWatcher(): () => void {
  return appStore.subscribe((state) => {
    const today = toDateKey(new Date());
    const ids = evaluateMilestones(getPersisted(state), today);
    if (ids.length === 0) return;
    state.unlockMilestones(ids, today);
    for (const id of ids) {
      showToast(i18n.t('milestones.unlocked', { title: MILESTONE_CONTENT[id].title }));
    }
  });
}
