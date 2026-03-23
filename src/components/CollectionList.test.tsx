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
  const onBack = vi.fn();

  it('renders all 8 collection titles', () => {
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} onBack={onBack} />,
    );

    for (const c of collections) {
      expect(screen.getByText(c.title)).toBeDefined();
    }
  });

  it('shows progress text for collections', () => {
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} onBack={onBack} />,
    );

    // All show "0/N" format — at least one exists for each verse count
    const progressTexts = screen.getAllByText(/^0\/\d+$/);
    expect(progressTexts.length).toBe(collections.length);
  });

  it('calls onSelectCollection when a collection is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} onBack={onBack} />,
    );

    await user.click(screen.getByText(collections[0].title));
    expect(onSelectCollection).toHaveBeenCalledWith(collections[0]);
  });

  it('calls onBack when back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CollectionList completedVerses={{}} onSelectCollection={onSelectCollection} onBack={onBack} />,
    );

    await user.click(screen.getByLabelText('뒤로 가기'));
    expect(onBack).toHaveBeenCalled();
  });

  it('shows partial progress for completed verses', () => {
    const completed = { '1jn-4-8': 1, 'jhn-3-16': 2 };
    render(
      <CollectionList completedVerses={completed} onSelectCollection={onSelectCollection} onBack={onBack} />,
    );

    // love collection has 8 verses, 2 completed
    expect(screen.getByText('2/8')).toBeDefined();
  });
});
