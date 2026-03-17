export type Difficulty = 'beginner' | 'easy' | 'normal';

export interface Verse {
  id: string;
  difficulty?: Difficulty;
  reference: string;
  verse: string;
  words: string[];
  hint?: string;
}

export type GameState = 
  | 'home' 
  | 'difficulty' 
  | 'playing' 
  | 'result'
  | 'select-bible'
  | 'select-mode'
  | 'reading'
  | 'memorizing'
  | 'custom-playing';

export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  chapters: BibleChapter[];
}

