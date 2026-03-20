export type Difficulty = 'beginner' | 'easy' | 'normal';

export interface Verse {
  id: string;
  difficulty?: Difficulty;
  bookId?: string;
  reference: string;
  verse: string;
  words: string[];
  hint?: string;
}

export type GameState =
  | 'onboarding'
  | 'home'
  | 'difficulty'
  | 'playing'
  | 'result'
  | 'select-bible'
  | 'select-mode'
  | 'reading'
  | 'memorizing'
  | 'custom-playing'
  | 'custom-complete'
  | 'profile'
  | 'collection-list'
  | 'collection-detail'
  | 'collection-playing'
  | 'collection-complete';

export interface OnboardingProfile {
  level: Difficulty;
  interests: string[];
  onboardingCompleted: boolean;
}

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBookMeta {
  id: string;
  name: string;
  abbr: string;
  testament: 'old' | 'new';
  chapterCount: number;
}

export interface BibleBook extends BibleBookMeta {
  chapters: BibleChapter[];
}

