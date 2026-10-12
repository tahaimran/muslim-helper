import { showToast } from '../components/Toast';
import { MILESTONE_CONTENT } from '../content/milestones';
import { toDateKey } from './day';
import i18n from './i18n';
import * as milestones from './milestones';
import { isTasbihOnlyChange } from './selectors';
import { appStore, getPersisted, type AppStore } from './store';

/** Unlocks newly earned milestones now and whenever the store changes. Call after hydration. Returns unsubscribe. */
export function startMilestoneWatcher(): () => void {
  const check = (state: AppStore, prev?: AppStore) => {
    // Tasbih taps are the hot path: once tasbih_1000 is unlocked, a change to tasbih counts
    // alone cannot earn anything (a day turning active is not tasbih-only), so skip the work.
    if (prev && state.milestones.tasbih_1000 && isTasbihOnlyChange(getPersisted(prev), getPersisted(state))) return;
    const today = toDateKey(new Date());
    const ids = milestones.evaluateMilestones(getPersisted(state), today);
    if (ids.length === 0) return;
    state.unlockMilestones(ids, today);
    showToast(
      ids.length === 1
        ? i18n.t('milestones.unlocked', { title: MILESTONE_CONTENT[ids[0]].title })
        : i18n.t('milestones.unlockedMany', { n: ids.length }),
    );
  };
  check(appStore.getState());
  return appStore.subscribe(check);
}
