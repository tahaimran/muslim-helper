import { showToast } from '../components/Toast';
import { MILESTONE_CONTENT } from '../content/milestones';
import { toDateKey } from './day';
import i18n from './i18n';
import { evaluateMilestones } from './milestones';
import { appStore, getPersisted, type AppStore } from './store';

/** Unlocks newly earned milestones whenever the store changes. Returns unsubscribe. */
/** Unlocks newly earned milestones now and whenever the store changes. Call after hydration. Returns unsubscribe. */
export function startMilestoneWatcher(): () => void {
  const check = (state: AppStore) => {
    const today = toDateKey(new Date());
    const ids = evaluateMilestones(getPersisted(state), today);
    if (ids.length === 0) return;
    state.unlockMilestones(ids, today);
    for (const id of ids) {
      showToast(i18n.t('milestones.unlocked', { title: MILESTONE_CONTENT[id].title }));
    }
  };
  check(appStore.getState());
  return appStore.subscribe(check);
}
