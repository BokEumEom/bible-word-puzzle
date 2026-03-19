import { SoundName, SoundDefinition } from './types';

export const SOUND_DEFINITIONS: Readonly<Record<SoundName, SoundDefinition>> = {
  'word-place': {
    type: 'sine',
    notes: [{ frequency: 800, startOffset: 0, duration: 0.08 }],
    gain: 0.3,
  },

  'correct': {
    type: 'sine',
    notes: [
      { frequency: 523, startOffset: 0, duration: 0.2 },
      { frequency: 659, startOffset: 0.15, duration: 0.2 },
      { frequency: 784, startOffset: 0.3, duration: 0.3 },
    ],
    gain: 0.35,
  },

  'wrong': {
    type: 'square',
    notes: [
      { frequency: 200, startOffset: 0, duration: 0.1 },
      { frequency: 180, startOffset: 0.18, duration: 0.1 },
    ],
    gain: 0.15,
  },

  'xp-gain': {
    type: 'triangle',
    notes: [
      { frequency: 440, startOffset: 0, duration: 0.08 },
      { frequency: 554, startOffset: 0.08, duration: 0.08 },
      { frequency: 659, startOffset: 0.16, duration: 0.12 },
    ],
    gain: 0.25,
  },

  'level-up': {
    type: 'sine',
    notes: [
      { frequency: 523, startOffset: 0, duration: 0.2 },
      { frequency: 659, startOffset: 0.15, duration: 0.2 },
      { frequency: 784, startOffset: 0.3, duration: 0.2 },
      { frequency: 1047, startOffset: 0.45, duration: 0.4 },
    ],
    gain: 0.3,
  },

  'achievement': {
    type: 'triangle',
    notes: [
      { frequency: 587, startOffset: 0, duration: 0.15 },
      { frequency: 740, startOffset: 0.12, duration: 0.15 },
      { frequency: 880, startOffset: 0.24, duration: 0.15 },
      { frequency: 1175, startOffset: 0.36, duration: 0.35 },
    ],
    gain: 0.3,
  },

  'combo': {
    type: 'sine',
    notes: [{ frequency: 600, startOffset: 0, duration: 0.1 }],
    gain: 0.25,
  },

  'button-tap': {
    type: 'sine',
    notes: [{ frequency: 1000, startOffset: 0, duration: 0.03 }],
    gain: 0.1,
  },
};
