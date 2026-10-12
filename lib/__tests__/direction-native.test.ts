const mockAllowRTL = jest.fn();
const mockForceRTL = jest.fn();
const mockRn = { isRTL: false };
jest.mock('react-native', () => ({
  I18nManager: {
    get isRTL() {
      return mockRn.isRTL;
    },
    allowRTL: (v: boolean) => mockAllowRTL(v),
    forceRTL: (v: boolean) => mockForceRTL(v),
  },
  DevSettings: {},
  Platform: { OS: 'android' },
}));
jest.mock('../store', () => ({ flushPersist: jest.fn() }));
import { applyDirection } from '../platform/direction';

afterEach(() => jest.clearAllMocks());

describe('applyDirection native flags', () => {
  it('allows and forces RTL for an RTL language', async () => {
    mockRn.isRTL = false;
    await applyDirection('ar');
    expect(mockAllowRTL).toHaveBeenCalledWith(true);
    expect(mockForceRTL).toHaveBeenCalledWith(true);
  });
  it('disallows RTL for an LTR language so an RTL phone renders LTR', async () => {
    mockRn.isRTL = true;
    await applyDirection('en');
    expect(mockAllowRTL).toHaveBeenCalledWith(false);
    expect(mockForceRTL).toHaveBeenCalledWith(false);
  });
});
