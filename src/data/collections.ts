import { Difficulty } from '../types';

export interface CollectionVerse {
  readonly bookId: string;
  readonly chapter: number;
  readonly verse: number;
  readonly reference: string;
  readonly hint: string;
  readonly difficulty: Difficulty;
}

export interface Collection {
  readonly id: string;
  readonly emoji: string;
  readonly title: string;
  readonly description: string;
  readonly color: string;         // tailwind color key (e.g. 'rose')
  readonly verses: readonly CollectionVerse[];
  readonly unlockRequirement?: {
    readonly collectionId: string;
    readonly percent: number;      // 0-100
  };
}

export const collections: readonly Collection[] = [
  {
    id: 'love',
    emoji: '❤️',
    title: '사랑의 말씀',
    description: '하나님의 사랑을 느껴보세요',
    color: 'rose',
    verses: [
      { bookId: '1jn', chapter: 4, verse: 8, reference: '요한일서 4:8', hint: '하나님의 가장 큰 마음은?', difficulty: 'beginner' },
      { bookId: 'jhn', chapter: 3, verse: 16, reference: '요한복음 3:16', hint: '독생자를 보내주신 사랑', difficulty: 'beginner' },
      { bookId: 'rom', chapter: 5, verse: 8, reference: '로마서 5:8', hint: '죄인이었을 때도 사랑하신 분', difficulty: 'easy' },
      { bookId: '1co', chapter: 13, verse: 4, reference: '고린도전서 13:4', hint: '사랑은 어떤 모습일까요?', difficulty: 'easy' },
      { bookId: '1co', chapter: 13, verse: 7, reference: '고린도전서 13:7', hint: '사랑은 모든 것을...', difficulty: 'easy' },
      { bookId: 'eph', chapter: 3, verse: 18, reference: '에베소서 3:18', hint: '사랑의 넓이와 깊이', difficulty: 'normal' },
      { bookId: '1jn', chapter: 4, verse: 19, reference: '요한일서 4:19', hint: '우리가 먼저 사랑한 게 아니에요', difficulty: 'easy' },
      { bookId: 'jhn', chapter: 15, verse: 13, reference: '요한복음 15:13', hint: '가장 큰 사랑의 표현', difficulty: 'normal' },
    ],
  },
  {
    id: 'hope',
    emoji: '🙏',
    title: '소망의 말씀',
    description: '어려울 때 힘이 되는 약속',
    color: 'sky',
    verses: [
      { bookId: 'rom', chapter: 8, verse: 28, reference: '로마서 8:28', hint: '모든 것이 합력하여...', difficulty: 'easy' },
      { bookId: 'jer', chapter: 29, verse: 11, reference: '예레미야 29:11', hint: '하나님의 계획은 평안', difficulty: 'easy' },
      { bookId: 'rom', chapter: 15, verse: 13, reference: '로마서 15:13', hint: '소망의 하나님', difficulty: 'easy' },
      { bookId: 'isa', chapter: 40, verse: 31, reference: '이사야 40:31', hint: '독수리처럼 날아오르는 힘', difficulty: 'normal' },
      { bookId: 'psa', chapter: 27, verse: 14, reference: '시편 27:14', hint: '여호와를 기다리면...', difficulty: 'easy' },
      { bookId: 'heb', chapter: 11, verse: 1, reference: '히브리서 11:1', hint: '믿음이란 무엇일까요?', difficulty: 'normal' },
      { bookId: 'lam', chapter: 3, verse: 22, reference: '예레미야애가 3:22', hint: '아침마다 새로운 은혜', difficulty: 'normal' },
    ],
  },
  {
    id: 'strength',
    emoji: '💪',
    title: '힘이 되는 말씀',
    description: '용기와 담대함을 얻어요',
    color: 'amber',
    unlockRequirement: { collectionId: 'love', percent: 50 },
    verses: [
      { bookId: 'php', chapter: 4, verse: 13, reference: '빌립보서 4:13', hint: '능력 주시는 분 안에서', difficulty: 'easy' },
      { bookId: 'jos', chapter: 1, verse: 9, reference: '여호수아 1:9', hint: '강하고 담대하라', difficulty: 'easy' },
      { bookId: 'isa', chapter: 41, verse: 10, reference: '이사야 41:10', hint: '두려워하지 말라', difficulty: 'normal' },
      { bookId: 'psa', chapter: 46, verse: 1, reference: '시편 46:1', hint: '하나님은 우리의 피난처', difficulty: 'easy' },
      { bookId: '2ti', chapter: 1, verse: 7, reference: '디모데후서 1:7', hint: '두려움의 영이 아니라...', difficulty: 'normal' },
      { bookId: 'deu', chapter: 31, verse: 6, reference: '신명기 31:6', hint: '결코 떠나지 않으시는 분', difficulty: 'normal' },
      { bookId: 'psa', chapter: 18, verse: 2, reference: '시편 18:2', hint: '나의 반석, 나의 요새', difficulty: 'normal' },
      { bookId: 'eph', chapter: 6, verse: 10, reference: '에베소서 6:10', hint: '주 안에서 강건하라', difficulty: 'normal' },
    ],
  },
  {
    id: 'comfort',
    emoji: '🕊️',
    title: '위로의 말씀',
    description: '마음이 평안해지는 구절들',
    color: 'emerald',
    unlockRequirement: { collectionId: 'hope', percent: 50 },
    verses: [
      { bookId: 'psa', chapter: 23, verse: 1, reference: '시편 23:1', hint: '여호와는 나의 목자', difficulty: 'easy' },
      { bookId: 'mat', chapter: 11, verse: 28, reference: '마태복음 11:28', hint: '수고하고 무거운 짐 진 자들아', difficulty: 'easy' },
      { bookId: '1pe', chapter: 5, verse: 7, reference: '베드로전서 5:7', hint: '염려를 맡기라', difficulty: 'normal' },
      { bookId: 'psa', chapter: 34, verse: 18, reference: '시편 34:18', hint: '마음이 상한 자에게 가까이', difficulty: 'normal' },
      { bookId: 'isa', chapter: 43, verse: 2, reference: '이사야 43:2', hint: '물 가운데로 지날 때에', difficulty: 'normal' },
      { bookId: 'psa', chapter: 23, verse: 4, reference: '시편 23:4', hint: '사망의 음침한 골짜기라도', difficulty: 'normal' },
      { bookId: 'jhn', chapter: 14, verse: 27, reference: '요한복음 14:27', hint: '평안을 너희에게 주노라', difficulty: 'normal' },
    ],
  },
  {
    id: 'thanks',
    emoji: '✨',
    title: '감사의 말씀',
    description: '감사로 하루를 시작해요',
    color: 'violet',
    unlockRequirement: { collectionId: 'strength', percent: 50 },
    verses: [
      { bookId: '1th', chapter: 5, verse: 16, reference: '데살로니가전서 5:16', hint: '항상!', difficulty: 'beginner' },
      { bookId: '1th', chapter: 5, verse: 17, reference: '데살로니가전서 5:17', hint: '쉬지 말고!', difficulty: 'beginner' },
      { bookId: '1th', chapter: 5, verse: 18, reference: '데살로니가전서 5:18', hint: '범사에!', difficulty: 'beginner' },
      { bookId: 'psa', chapter: 100, verse: 4, reference: '시편 100:4', hint: '감사함으로 그의 문에', difficulty: 'easy' },
      { bookId: 'psa', chapter: 107, verse: 1, reference: '시편 107:1', hint: '여호와께 감사하라', difficulty: 'easy' },
      { bookId: 'col', chapter: 3, verse: 17, reference: '골로새서 3:17', hint: '무엇을 하든지 감사', difficulty: 'normal' },
      { bookId: 'psa', chapter: 150, verse: 6, reference: '시편 150:6', hint: '호흡이 있는 자마다', difficulty: 'easy' },
    ],
  },
  {
    id: 'prayer',
    emoji: '🙌',
    title: '기도의 말씀',
    description: '하나님과 대화하는 법',
    color: 'indigo',
    unlockRequirement: { collectionId: 'comfort', percent: 50 },
    verses: [
      { bookId: 'mat', chapter: 7, verse: 7, reference: '마태복음 7:7', hint: '구하라 그리하면', difficulty: 'easy' },
      { bookId: 'php', chapter: 4, verse: 6, reference: '빌립보서 4:6', hint: '아무것도 염려하지 말고', difficulty: 'normal' },
      { bookId: 'jer', chapter: 33, verse: 3, reference: '예레미야 33:3', hint: '내게 부르짖으라', difficulty: 'easy' },
      { bookId: 'jas', chapter: 5, verse: 16, reference: '야고보서 5:16', hint: '의인의 기도는 역사하는 힘', difficulty: 'normal' },
      { bookId: 'psa', chapter: 145, verse: 18, reference: '시편 145:18', hint: '여호와께서 가까이 하시는 자', difficulty: 'normal' },
      { bookId: 'mat', chapter: 6, verse: 6, reference: '마태복음 6:6', hint: '골방에 들어가 문을 닫고', difficulty: 'normal' },
      { bookId: '1jn', chapter: 5, verse: 14, reference: '요한일서 5:14', hint: '그의 뜻대로 구하면', difficulty: 'normal' },
    ],
  },
  {
    id: 'wisdom',
    emoji: '💡',
    title: '지혜의 말씀',
    description: '삶의 지혜를 배워요',
    color: 'orange',
    unlockRequirement: { collectionId: 'thanks', percent: 50 },
    verses: [
      { bookId: 'pro', chapter: 3, verse: 5, reference: '잠언 3:5', hint: '마음을 다하여 신뢰하라', difficulty: 'normal' },
      { bookId: 'pro', chapter: 1, verse: 7, reference: '잠언 1:7', hint: '지식의 근본', difficulty: 'normal' },
      { bookId: 'jas', chapter: 1, verse: 5, reference: '야고보서 1:5', hint: '지혜가 부족하면 구하라', difficulty: 'normal' },
      { bookId: 'psa', chapter: 119, verse: 105, reference: '시편 119:105', hint: '내 발에 등이요', difficulty: 'easy' },
      { bookId: 'pro', chapter: 4, verse: 7, reference: '잠언 4:7', hint: '지혜가 제일이니', difficulty: 'easy' },
      { bookId: 'pro', chapter: 16, verse: 3, reference: '잠언 16:3', hint: '네 일을 여호와께 맡기라', difficulty: 'normal' },
      { bookId: 'col', chapter: 3, verse: 16, reference: '골로새서 3:16', hint: '그리스도의 말씀이 풍성히', difficulty: 'normal' },
      { bookId: 'psa', chapter: 1, verse: 2, reference: '시편 1:2', hint: '주야로 묵상하는 자', difficulty: 'normal' },
    ],
  },
  {
    id: 'faith',
    emoji: '⛰️',
    title: '믿음의 말씀',
    description: '흔들리지 않는 믿음을 세워요',
    color: 'teal',
    unlockRequirement: { collectionId: 'prayer', percent: 50 },
    verses: [
      { bookId: 'heb', chapter: 11, verse: 6, reference: '히브리서 11:6', hint: '믿음이 없이는 하나님을...', difficulty: 'normal' },
      { bookId: 'rom', chapter: 10, verse: 17, reference: '로마서 10:17', hint: '믿음은 들음에서', difficulty: 'easy' },
      { bookId: 'gal', chapter: 2, verse: 20, reference: '갈라디아서 2:20', hint: '내가 산 것이 아니요', difficulty: 'normal' },
      { bookId: 'mrk', chapter: 11, verse: 24, reference: '마가복음 11:24', hint: '기도할 때 받은 줄 믿으라', difficulty: 'normal' },
      { bookId: '2co', chapter: 5, verse: 7, reference: '고린도후서 5:7', hint: '눈에 보이는 것이 아니라', difficulty: 'easy' },
      { bookId: 'rom', chapter: 8, verse: 31, reference: '로마서 8:31', hint: '하나님이 우리를 위하시면', difficulty: 'normal' },
      { bookId: 'mat', chapter: 17, verse: 20, reference: '마태복음 17:20', hint: '겨자씨 한 알만한 믿음', difficulty: 'normal' },
    ],
  },
];
