import { showToast } from '../../components/Toast';
import * as milestones from '../milestones';
import { toDateKey } from '../day';
import { startMilestoneWatcher } from '../milestoneWatcher';
import { appStore } from '../store';
import { initialState } from '../model';

jest.mock('../../components/Toast', () => ({ showToast: jest.fn() }));
jest.mock('../i18n', () => ({
  __esModule: true,
  default: { t: (key: string, opts?: Record<string, unknown>) => `${key}${opts ? JSON.stringify(opts) : ''}` },
}));

const toast = showToast as jest.Mock;
const today = () => toDateKey(new Date());

beforeEach(() => {
  toast.mockClear();
  appStore.setState({ ...initialState() });
});

describe('startMilestoneWatcher', () => {
  it('shows one combined toast when several milestones unlock at once', () => {
    const stop = startMilestoneWatcher();
    try {
      // One change that earns first_step and tasbih_1000 together.
      appStore.getState().incrementTasbih(today(), 'subhanallah', 1000);
      expect(appStore.getState().milestones).toHaveProperty('first_step');
      expect(appStore.getState().milestones).toHaveProperty('tasbih_1000');
      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast.mock.calls[0][0]).toContain('milestones.unlockedMany');
    } finally {
      stop();
    }
  });

  it('names the milestone when only one unlocks', () => {
    const stop = startMilestoneWatcher();
    try {
      appStore.getState().togglePrayer(today(), 'fajr');
      expect(toast).toHaveBeenCalledTimes(1);
      expect(toast.mock.calls[0][0]).toContain('milestones.unlocked{');
    } finally {
      stop();
    }
  });

  it('skips evaluation on tasbih-only taps once tasbih_1000 is unlocked', () => {
    const stop = startMilestoneWatcher();
    const spy = jest.spyOn(milestones, 'evaluateMilestones');
    try {
      appStore.getState().incrementTasbih(today(), 'subhanallah', 1000);
      spy.mockClear();
      appStore.getState().incrementTasbih(today(), 'subhanallah');
      appStore.getState().incrementTasbih(today(), 'subhanallah');
      expect(spy).not.toHaveBeenCalled();
      // Any other change is still evaluated.
      appStore.getState().togglePrayer(today(), 'fajr');
      expect(spy).toHaveBeenCalled();
    } finally {
      spy.mockRestore();
      stop();
    }
  });

  it('still evaluates tasbih taps before tasbih_1000 is reached', () => {
    const stop = startMilestoneWatcher();
    try {
      appStore.getState().incrementTasbih(today(), 'subhanallah', 998);
      toast.mockClear();
      appStore.getState().incrementTasbih(today(), 'subhanallah');
      expect(appStore.getState().milestones).not.toHaveProperty('tasbih_1000');
      appStore.getState().incrementTasbih(today(), 'subhanallah');
      expect(appStore.getState().milestones).toHaveProperty('tasbih_1000');
      expect(toast).toHaveBeenCalledTimes(1);
    } finally {
      stop();
    }
  });
});
