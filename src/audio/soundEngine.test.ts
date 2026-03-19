import { describe, it, expect, vi, beforeEach } from 'vitest';

const MUTE_KEY = 'bible_puzzle_sound_muted';

let play: typeof import('./soundEngine').play;
let isMuted: typeof import('./soundEngine').isMuted;
let setMuted: typeof import('./soundEngine').setMuted;

function makeMockContext() {
  const oscillators: { type: string; frequency: { value: number }; connect: ReturnType<typeof vi.fn>; start: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn> }[] = [];

  const ctx = {
    currentTime: 0,
    state: 'running' as AudioContextState,
    destination: {},
    resume: vi.fn(),
    createOscillator: vi.fn(() => {
      const osc = {
        type: 'sine' as string,
        frequency: { value: 0 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
      oscillators.push(osc);
      return osc;
    }),
    createGain: vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    })),
  };

  return { ctx, oscillators };
}

function stubAudioContext(ctx: ReturnType<typeof makeMockContext>['ctx']) {
  (globalThis as any).AudioContext = function () { return ctx; };
}

beforeEach(async () => {
  localStorage.clear();
  vi.restoreAllMocks();
  delete (globalThis as any).AudioContext;
  vi.resetModules();
  const mod = await import('./soundEngine');
  play = mod.play;
  isMuted = mod.isMuted;
  setMuted = mod.setMuted;
});

describe('soundEngine', () => {
  describe('isMuted / setMuted', () => {
    it('returns false by default', () => {
      expect(isMuted()).toBe(false);
    });

    it('returns true after setMuted(true)', () => {
      setMuted(true);
      expect(isMuted()).toBe(true);
      expect(localStorage.getItem(MUTE_KEY)).toBe('true');
    });

    it('returns false after setMuted(false)', () => {
      setMuted(true);
      setMuted(false);
      expect(isMuted()).toBe(false);
    });
  });

  describe('play', () => {
    it('does nothing when muted', () => {
      const { ctx } = makeMockContext();
      stubAudioContext(ctx);

      setMuted(true);
      play('correct');

      expect(ctx.createOscillator).not.toHaveBeenCalled();
    });

    it('creates oscillator and gain nodes when unmuted', () => {
      const { ctx } = makeMockContext();
      stubAudioContext(ctx);

      play('word-place'); // 1 note

      expect(ctx.createOscillator).toHaveBeenCalledTimes(1);
      expect(ctx.createGain).toHaveBeenCalledTimes(1);
    });

    it('creates multiple oscillators for multi-note sounds', () => {
      const { ctx } = makeMockContext();
      stubAudioContext(ctx);

      play('correct'); // 3 notes

      expect(ctx.createOscillator).toHaveBeenCalledTimes(3);
      expect(ctx.createGain).toHaveBeenCalledTimes(3);
    });

    it('applies pitch multiplier', () => {
      const { ctx, oscillators } = makeMockContext();
      stubAudioContext(ctx);

      play('word-place', { pitchMultiplier: 1.5 });

      expect(oscillators[0].frequency.value).toBe(800 * 1.5);
    });

    it('handles missing AudioContext gracefully', () => {
      delete (globalThis as any).AudioContext;
      expect(() => play('correct')).not.toThrow();
    });
  });
});
