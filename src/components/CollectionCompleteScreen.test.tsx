import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionCompleteScreen } from './CollectionCompleteScreen';
import { Collection } from '../data/collections';
import { Verse } from '../types';

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    button: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, whileHover, whileTap, ...rest } = props;
      return <button {...rest}>{children}</button>;
    },
    p: ({ children, ...props }: any) => {
      const { initial, animate, exit, transition, ...rest } = props;
      return <p {...rest}>{children}</p>;
    },
  },
}));

const testCollection: Collection = {
  id: 'love',
  emoji: '❤️',
  title: '사랑의 말씀',
  description: '하나님의 사랑을 느껴보세요',
  color: 'rose',
  verses: [
    { bookId: '1jn', chapter: 4, verse: 8, reference: '요한일서 4:8', hint: 'hint1', difficulty: 'beginner' },
    { bookId: 'jhn', chapter: 3, verse: 16, reference: '요한복음 3:16', hint: 'hint2', difficulty: 'beginner' },
  ],
};

const testVerse: Verse = {
  id: '1jn-4-8',
  reference: '요한일서 4:8',
  verse: '하나님은 사랑이시라',
  words: ['하나님은', '사랑이시라'],
  difficulty: 'beginner',
};

describe('CollectionCompleteScreen', () => {
  const onNext = vi.fn();
  const onBackToCollection = vi.fn();
  const onHome = vi.fn();

  it('renders verse reference and text', () => {
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={{ '1jn-4-8': 1 }}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    expect(screen.getByText('요한일서 4:8')).toBeDefined();
    expect(screen.getByText('하나님은 사랑이시라')).toBeDefined();
  });

  it('shows "다음 구절" button when collection is not complete', () => {
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={{ '1jn-4-8': 1 }}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    expect(screen.getByText('다음 구절')).toBeDefined();
    expect(screen.getByText('잘했어요!')).toBeDefined();
  });

  it('hides "다음 구절" and shows "컬렉션 완료!" when collection is complete', () => {
    const allCompleted = { '1jn-4-8': 1, 'jhn-3-16': 1 };
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={allCompleted}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    expect(screen.getByText('컬렉션 완료!')).toBeDefined();
    expect(screen.queryByText('다음 구절')).toBeNull();
  });

  it('calls onNext when "다음 구절" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={{ '1jn-4-8': 1 }}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    await user.click(screen.getByText('다음 구절'));
    expect(onNext).toHaveBeenCalled();
  });

  it('calls onHome when "홈으로" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={{ '1jn-4-8': 1 }}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    await user.click(screen.getByText('홈으로'));
    expect(onHome).toHaveBeenCalled();
  });

  it('calls onBackToCollection when "구절 목록" is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionCompleteScreen
        verse={testVerse}
        collection={testCollection}
        completedVerses={{ '1jn-4-8': 1 }}
        onNext={onNext}
        onBackToCollection={onBackToCollection}
        onHome={onHome}
      />,
    );

    await user.click(screen.getByText('구절 목록'));
    expect(onBackToCollection).toHaveBeenCalled();
  });
});
