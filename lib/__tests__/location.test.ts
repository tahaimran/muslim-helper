jest.mock('expo-location', () => ({
  Accuracy: { Balanced: 3 },
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));
import * as Location from 'expo-location';
import { getCurrentCoords } from '../platform/location';

const perm = Location.requestForegroundPermissionsAsync as jest.Mock;
const pos = Location.getCurrentPositionAsync as jest.Mock;

afterEach(() => jest.clearAllMocks());

describe('getCurrentCoords', () => {
  it('returns coordinates when granted', async () => {
    perm.mockResolvedValue({ status: 'granted' });
    pos.mockResolvedValue({ coords: { latitude: 1.5, longitude: 2.5 } });
    await expect(getCurrentCoords()).resolves.toEqual({ ok: true, latitude: 1.5, longitude: 2.5 });
    expect(pos).toHaveBeenCalledWith({ accuracy: 3 });
  });
  it('reports denied without reading the position', async () => {
    perm.mockResolvedValue({ status: 'denied' });
    await expect(getCurrentCoords()).resolves.toEqual({ ok: false, reason: 'denied' });
    expect(pos).not.toHaveBeenCalled();
  });
  it('reports unavailable on errors', async () => {
    perm.mockResolvedValue({ status: 'granted' });
    pos.mockRejectedValue(new Error('no fix'));
    await expect(getCurrentCoords()).resolves.toEqual({ ok: false, reason: 'unavailable' });
  });
  it('times out after 10 seconds', async () => {
    jest.useFakeTimers();
    perm.mockResolvedValue({ status: 'granted' });
    pos.mockReturnValue(new Promise(() => {}));
    const p = getCurrentCoords();
    await jest.advanceTimersByTimeAsync(10_001);
    await expect(p).resolves.toEqual({ ok: false, reason: 'unavailable' });
    jest.useRealTimers();
  });
});
