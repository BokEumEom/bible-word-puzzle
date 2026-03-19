import { describe, it, expect } from 'vitest';
import { SOUND_DEFINITIONS } from './sounds';
import { SoundName } from './types';

const ALL_SOUND_NAMES: SoundName[] = [
  'word-place', 'correct', 'wrong', 'xp-gain',
  'level-up', 'achievement', 'combo', 'button-tap',
];

describe('SOUND_DEFINITIONS', () => {
  it('defines all 8 sound types', () => {
    for (const name of ALL_SOUND_NAMES) {
      expect(SOUND_DEFINITIONS[name]).toBeDefined();
    }
  });

  it.each(ALL_SOUND_NAMES)('%s has valid gain (0-1)', (name) => {
    const def = SOUND_DEFINITIONS[name];
    expect(def.gain).toBeGreaterThan(0);
    expect(def.gain).toBeLessThanOrEqual(1);
  });

  it.each(ALL_SOUND_NAMES)('%s has at least one note', (name) => {
    expect(SOUND_DEFINITIONS[name].notes.length).toBeGreaterThanOrEqual(1);
  });

  it.each(ALL_SOUND_NAMES)('%s has positive frequencies and durations', (name) => {
    for (const note of SOUND_DEFINITIONS[name].notes) {
      expect(note.frequency).toBeGreaterThan(0);
      expect(note.duration).toBeGreaterThan(0);
      expect(note.startOffset).toBeGreaterThanOrEqual(0);
    }
  });

  it.each(ALL_SOUND_NAMES)('%s has valid oscillator type', (name) => {
    const validTypes = ['sine', 'square', 'sawtooth', 'triangle'];
    expect(validTypes).toContain(SOUND_DEFINITIONS[name].type);
  });
});
