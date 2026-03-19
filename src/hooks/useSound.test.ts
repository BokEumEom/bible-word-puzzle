import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSound } from './useSound';

vi.mock('../audio/soundEngine', () => ({
  play: vi.fn(),
  isMuted: vi.fn(() => false),
  setMuted: vi.fn(),
}));

import * as engine from '../audio/soundEngine';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSound', () => {
  it('returns play, isMuted, and toggleMute', () => {
    const { result } = renderHook(() => useSound());
    expect(result.current.play).toBeTypeOf('function');
    expect(result.current.toggleMute).toBeTypeOf('function');
    expect(typeof result.current.isMuted).toBe('boolean');
  });

  it('play delegates to engine.play', () => {
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play('correct');
    });
    expect(engine.play).toHaveBeenCalledWith('correct', undefined);
  });

  it('play passes options to engine', () => {
    const { result } = renderHook(() => useSound());
    act(() => {
      result.current.play('combo', { pitchMultiplier: 1.3 });
    });
    expect(engine.play).toHaveBeenCalledWith('combo', { pitchMultiplier: 1.3 });
  });

  it('isMuted reads from engine on init', () => {
    vi.mocked(engine.isMuted).mockReturnValue(true);
    const { result } = renderHook(() => useSound());
    expect(result.current.isMuted).toBe(true);
  });

  it('toggleMute flips muted state and calls engine', () => {
    vi.mocked(engine.isMuted).mockReturnValue(false);
    const { result } = renderHook(() => useSound());

    expect(result.current.isMuted).toBe(false);

    act(() => {
      result.current.toggleMute();
    });

    expect(engine.setMuted).toHaveBeenCalledWith(true);
    expect(result.current.isMuted).toBe(true);
  });
});
