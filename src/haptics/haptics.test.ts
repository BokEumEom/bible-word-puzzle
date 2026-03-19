import { describe, it, expect, vi, beforeEach } from 'vitest';
import { vibrateShort, vibrateError, vibrateSuccess } from './haptics';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('haptics', () => {
  it('vibrateShort calls navigator.vibrate(10)', () => {
    const vibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });

    vibrateShort();
    expect(vibrate).toHaveBeenCalledWith(10);
  });

  it('vibrateError calls navigator.vibrate with double pulse', () => {
    const vibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });

    vibrateError();
    expect(vibrate).toHaveBeenCalledWith([10, 50, 10]);
  });

  it('vibrateSuccess calls navigator.vibrate with pattern', () => {
    const vibrate = vi.fn();
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true });

    vibrateSuccess();
    expect(vibrate).toHaveBeenCalledWith([30, 50, 30, 50, 60]);
  });

  it('handles missing navigator.vibrate gracefully', () => {
    Object.defineProperty(navigator, 'vibrate', { value: undefined, configurable: true });
    expect(() => vibrateShort()).not.toThrow();
    expect(() => vibrateError()).not.toThrow();
    expect(() => vibrateSuccess()).not.toThrow();
  });
});
