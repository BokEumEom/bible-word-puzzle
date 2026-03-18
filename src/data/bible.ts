import { BibleBookMeta, BibleChapter } from '../types';

export const bibleIndex: BibleBookMeta[] = [
  { id: 'gen', name: '창세기', abbr: '창', testament: 'old', chapterCount: 50 },
  { id: 'exo', name: '출애굽기', abbr: '출', testament: 'old', chapterCount: 40 },
  { id: 'lev', name: '레위기', abbr: '레', testament: 'old', chapterCount: 27 },
  { id: 'num', name: '민수기', abbr: '민', testament: 'old', chapterCount: 36 },
  { id: 'deu', name: '신명기', abbr: '신', testament: 'old', chapterCount: 34 },
  { id: 'jos', name: '여호수아', abbr: '수', testament: 'old', chapterCount: 24 },
  { id: 'jdg', name: '사사기', abbr: '삿', testament: 'old', chapterCount: 21 },
  { id: 'rut', name: '룻기', abbr: '룻', testament: 'old', chapterCount: 4 },
  { id: '1sa', name: '사무엘상', abbr: '삼상', testament: 'old', chapterCount: 31 },
  { id: '2sa', name: '사무엘하', abbr: '삼하', testament: 'old', chapterCount: 24 },
  { id: '1ki', name: '열왕기상', abbr: '왕상', testament: 'old', chapterCount: 22 },
  { id: '2ki', name: '열왕기하', abbr: '왕하', testament: 'old', chapterCount: 25 },
  { id: '1ch', name: '역대상', abbr: '대상', testament: 'old', chapterCount: 29 },
  { id: '2ch', name: '역대하', abbr: '대하', testament: 'old', chapterCount: 36 },
  { id: 'ezr', name: '에스라', abbr: '스', testament: 'old', chapterCount: 10 },
  { id: 'neh', name: '느헤미야', abbr: '느', testament: 'old', chapterCount: 13 },
  { id: 'est', name: '에스더', abbr: '더', testament: 'old', chapterCount: 10 },
  { id: 'job', name: '욥기', abbr: '욥', testament: 'old', chapterCount: 42 },
  { id: 'psa', name: '시편', abbr: '시', testament: 'old', chapterCount: 150 },
  { id: 'pro', name: '잠언', abbr: '잠', testament: 'old', chapterCount: 31 },
  { id: 'ecc', name: '전도서', abbr: '전', testament: 'old', chapterCount: 12 },
  { id: 'sng', name: '아가', abbr: '아', testament: 'old', chapterCount: 8 },
  { id: 'isa', name: '이사야', abbr: '사', testament: 'old', chapterCount: 66 },
  { id: 'jer', name: '예레미야', abbr: '렘', testament: 'old', chapterCount: 52 },
  { id: 'lam', name: '예레미야애가', abbr: '애', testament: 'old', chapterCount: 5 },
  { id: 'ezk', name: '에스겔', abbr: '겔', testament: 'old', chapterCount: 48 },
  { id: 'dan', name: '다니엘', abbr: '단', testament: 'old', chapterCount: 12 },
  { id: 'hos', name: '호세아', abbr: '호', testament: 'old', chapterCount: 14 },
  { id: 'jol', name: '요엘', abbr: '욜', testament: 'old', chapterCount: 3 },
  { id: 'amo', name: '아모스', abbr: '암', testament: 'old', chapterCount: 9 },
  { id: 'oba', name: '오바댜', abbr: '옵', testament: 'old', chapterCount: 1 },
  { id: 'jon', name: '요나', abbr: '욘', testament: 'old', chapterCount: 4 },
  { id: 'mic', name: '미가', abbr: '미', testament: 'old', chapterCount: 7 },
  { id: 'nam', name: '나훔', abbr: '나', testament: 'old', chapterCount: 3 },
  { id: 'hab', name: '하박국', abbr: '합', testament: 'old', chapterCount: 3 },
  { id: 'zep', name: '스바냐', abbr: '습', testament: 'old', chapterCount: 3 },
  { id: 'hag', name: '학개', abbr: '학', testament: 'old', chapterCount: 2 },
  { id: 'zec', name: '스가랴', abbr: '슥', testament: 'old', chapterCount: 14 },
  { id: 'mal', name: '말라기', abbr: '말', testament: 'old', chapterCount: 4 },
  { id: 'mat', name: '마태복음', abbr: '마', testament: 'new', chapterCount: 28 },
  { id: 'mrk', name: '마가복음', abbr: '막', testament: 'new', chapterCount: 16 },
  { id: 'luk', name: '누가복음', abbr: '눅', testament: 'new', chapterCount: 24 },
  { id: 'jhn', name: '요한복음', abbr: '요', testament: 'new', chapterCount: 21 },
  { id: 'act', name: '사도행전', abbr: '행', testament: 'new', chapterCount: 28 },
  { id: 'rom', name: '로마서', abbr: '롬', testament: 'new', chapterCount: 16 },
  { id: '1co', name: '고린도전서', abbr: '고전', testament: 'new', chapterCount: 16 },
  { id: '2co', name: '고린도후서', abbr: '고후', testament: 'new', chapterCount: 13 },
  { id: 'gal', name: '갈라디아서', abbr: '갈', testament: 'new', chapterCount: 6 },
  { id: 'eph', name: '에베소서', abbr: '엡', testament: 'new', chapterCount: 6 },
  { id: 'php', name: '빌립보서', abbr: '빌', testament: 'new', chapterCount: 4 },
  { id: 'col', name: '골로새서', abbr: '골', testament: 'new', chapterCount: 4 },
  { id: '1th', name: '데살로니가전서', abbr: '살전', testament: 'new', chapterCount: 5 },
  { id: '2th', name: '데살로니가후서', abbr: '살후', testament: 'new', chapterCount: 3 },
  { id: '1ti', name: '디모데전서', abbr: '딤전', testament: 'new', chapterCount: 6 },
  { id: '2ti', name: '디모데후서', abbr: '딤후', testament: 'new', chapterCount: 4 },
  { id: 'tit', name: '디도서', abbr: '딛', testament: 'new', chapterCount: 3 },
  { id: 'phm', name: '빌레몬서', abbr: '몬', testament: 'new', chapterCount: 1 },
  { id: 'heb', name: '히브리서', abbr: '히', testament: 'new', chapterCount: 13 },
  { id: 'jas', name: '야고보서', abbr: '약', testament: 'new', chapterCount: 5 },
  { id: '1pe', name: '베드로전서', abbr: '벧전', testament: 'new', chapterCount: 5 },
  { id: '2pe', name: '베드로후서', abbr: '벧후', testament: 'new', chapterCount: 3 },
  { id: '1jn', name: '요한일서', abbr: '요일', testament: 'new', chapterCount: 5 },
  { id: '2jn', name: '요한이서', abbr: '요이', testament: 'new', chapterCount: 1 },
  { id: '3jn', name: '요한삼서', abbr: '요삼', testament: 'new', chapterCount: 1 },
  { id: 'jud', name: '유다서', abbr: '유', testament: 'new', chapterCount: 1 },
  { id: 'rev', name: '요한계시록', abbr: '계', testament: 'new', chapterCount: 22 },
];

const bookCache = new Map<string, BibleChapter[]>();

export class BookLoadError extends Error {
  constructor(bookId: string, cause?: unknown) {
    super(`Failed to load book: ${bookId}`);
    this.name = 'BookLoadError';
    this.cause = cause;
  }
}

export async function loadBookChapters(bookId: string): Promise<BibleChapter[]> {
  const cached = bookCache.get(bookId);
  if (cached) return cached;

  try {
    const response = await fetch(`/bible/${bookId}.json`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const chapters: BibleChapter[] = await response.json();
    bookCache.set(bookId, chapters);
    return chapters;
  } catch (error) {
    throw new BookLoadError(bookId, error);
  }
}
