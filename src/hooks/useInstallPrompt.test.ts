import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInstallPrompt } from './useInstallPrompt';

const DISMISS_KEY = 'pwa_install_dismissed_at';

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
  // jsdom doesn't have matchMedia
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe('useInstallPrompt', () => {
  it('starts with canInstall false', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.canInstall).toBe(false);
  });

  it('starts with isStandalone false in jsdom', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isStandalone).toBe(false);
  });

  it('starts with isDismissedByUser false when no localStorage entry', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isDismissedByUser).toBe(false);
  });

  it('respects recent dismissal from localStorage', () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isDismissedByUser).toBe(true);
  });

  it('ignores old dismissal (>7 days)', () => {
    const eightDaysAgo = Date.now() - 8 * 24 * 60 * 60 * 1000;
    localStorage.setItem(DISMISS_KEY, String(eightDaysAgo));
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isDismissedByUser).toBe(false);
  });

  it('dismiss saves to localStorage and sets isDismissedByUser', () => {
    const { result } = renderHook(() => useInstallPrompt());
    expect(result.current.isDismissedByUser).toBe(false);

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.isDismissedByUser).toBe(true);
    expect(localStorage.getItem(DISMISS_KEY)).toBeTruthy();
  });

  it('sets canInstall when beforeinstallprompt fires', () => {
    const { result } = renderHook(() => useInstallPrompt());

    const event = new Event('beforeinstallprompt');
    Object.assign(event, {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(result.current.canInstall).toBe(true);
  });

  it('promptInstall calls prompt on the deferred event', async () => {
    const { result } = renderHook(() => useInstallPrompt());

    const mockPrompt = vi.fn().mockResolvedValue(undefined);
    const event = new Event('beforeinstallprompt');
    Object.assign(event, {
      prompt: mockPrompt,
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    act(() => {
      window.dispatchEvent(event);
    });

    await act(async () => {
      await result.current.promptInstall();
    });

    expect(mockPrompt).toHaveBeenCalled();
  });
});
