import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CollectionList } from './CollectionList';
import { collections } from '../data/collections';

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

describe('CollectionList', () => {
  const onSelectCollection = vi.fn();
  const totalVerseCount = collections.reduce((sum, collection) => sum + collection.verses.length, 0);

  it('renders a root-tab header and summary card for the theme library', () => {
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} />,
    );

    const summaryCard = screen.getByTestId('collection-summary-card');

    expect(screen.getByText('테마')).toBeDefined();
    expect(summaryCard.className).toContain('bg-white');
    expect(summaryCard.className).toContain('rounded-3xl');
    expect(summaryCard.className).toContain('border');
    expect(summaryCard.className).toContain('shadow-sm');
    expect(summaryCard.textContent).toContain(`${collections.length}개 테마`);
    expect(summaryCard.textContent).toContain(`${totalVerseCount}개 말씀`);
  });

  it('renders all collection titles inside soft white list cards', () => {
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} />,
    );

    for (const c of collections) {
      expect(screen.getByText(c.title)).toBeDefined();
    }

    const firstRow = screen.getByTestId(`collection-row-${collections[0].id}`);
    const firstIcon = screen.getByTestId(`collection-icon-${collections[0].id}`);
    expect(firstRow.className).toContain('bg-white');
    expect(firstRow.className).toContain('rounded-3xl');
    expect(firstRow.className).toContain('border');
    expect(firstRow.className).toContain('shadow-sm');
    expect(firstIcon.className).toContain('rounded-2xl');
  });

  it('calls onSelectCollection when a collection is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} />,
    );

    await user.click(screen.getByText(collections[0].title));
    expect(onSelectCollection).toHaveBeenCalledWith(collections[0]);
  });

  it('shows progress text for collections in the summary and each row', () => {
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} />,
    );

    const progressTexts = screen.getAllByText(/^0\/\d+$/);
    expect(progressTexts.length).toBe(collections.length + 1);
  });

  it('shows partial progress for completed verses', () => {
    const completed = { '1jn-4-8': 1, 'jhn-3-16': 2 };
    render(
      <CollectionList completedVerses={completed} onSelectCollection={onSelectCollection} />,
    );

    // love collection has 8 verses, 2 completed
    expect(screen.getByText('2/8')).toBeDefined();
  });
});
