import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionDetail } from './CollectionDetail';
import { Collection } from '../data/collections';

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
  },
}));

const testCollection: Collection = {
  id: 'love',
  emoji: '❤️',
  title: '사랑의 말씀',
  description: '하나님의 사랑을 느껴보세요',
  color: 'rose',
  verses: [
    { bookId: '1jn', chapter: 4, verse: 8, reference: '요한일서 4:8', hint: '하나님의 마음', difficulty: 'beginner' },
    { bookId: 'jhn', chapter: 3, verse: 16, reference: '요한복음 3:16', hint: '독생자를 보내주신', difficulty: 'beginner' },
    { bookId: 'rom', chapter: 5, verse: 8, reference: '로마서 5:8', hint: '죄인이었을 때도', difficulty: 'easy' },
  ],
};

describe('CollectionDetail', () => {
  const onPlayVerse = vi.fn();
  const onBack = vi.fn();

  it('renders collection title and description inside a soft summary card', () => {
    render(
      <CollectionDetail collection={testCollection} completedVerses={{}} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    const summaryCard = screen.getByTestId('collection-detail-summary-card');

    expect(summaryCard.className).toContain('bg-white');
    expect(summaryCard.className).toContain('rounded-3xl');
    expect(summaryCard.className).toContain('border');
    expect(summaryCard.className).toContain('shadow-sm');
    expect(screen.getByText('사랑의 말씀')).toBeDefined();
    expect(screen.getByText('하나님의 사랑을 느껴보세요')).toBeDefined();
  });

  it('renders all verse references inside soft white list cards', () => {
    render(
      <CollectionDetail collection={testCollection} completedVerses={{}} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    const firstVerseRow = screen.getByTestId('collection-detail-verse-row-1jn-4-8');

    expect(firstVerseRow.className).toContain('bg-white');
    expect(firstVerseRow.className).toContain('rounded-3xl');
    expect(firstVerseRow.className).toContain('border');
    expect(firstVerseRow.className).toContain('shadow-sm');
    expect(screen.getByText('요한일서 4:8')).toBeDefined();
    expect(screen.getByText('요한복음 3:16')).toBeDefined();
    expect(screen.getByText('로마서 5:8')).toBeDefined();
  });

  it('shows progress as 0/3', () => {
    render(
      <CollectionDetail collection={testCollection} completedVerses={{}} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    expect(screen.getByText('0/3')).toBeDefined();
  });

  it('shows completion count for completed verses', () => {
    const completed = { '1jn-4-8': 3 };
    render(
      <CollectionDetail collection={testCollection} completedVerses={completed} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    expect(screen.getByText('3회')).toBeDefined();
    expect(screen.getByText('1/3')).toBeDefined();
  });

  it('calls onPlayVerse when a verse is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionDetail collection={testCollection} completedVerses={{}} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    await user.click(screen.getByText('요한일서 4:8'));
    expect(onPlayVerse).toHaveBeenCalledWith(testCollection.verses[0]);
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionDetail collection={testCollection} completedVerses={{}} onPlayVerse={onPlayVerse} onBack={onBack} />,
    );

    await user.click(screen.getByLabelText('뒤로 가기'));
    expect(onBack).toHaveBeenCalled();
  });
});
