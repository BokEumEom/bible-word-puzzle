import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the virtual module before importing the component
const mockUpdateServiceWorker = vi.fn();
let mockNeedRefresh = false;
const mockSetNeedRefresh = vi.fn();

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({
    needRefresh: [mockNeedRefresh, mockSetNeedRefresh],
    offlineReady: [false, vi.fn()],
    updateServiceWorker: mockUpdateServiceWorker,
  }),
}));

import { UpdatePrompt } from './UpdatePrompt';

beforeEach(() => {
  vi.clearAllMocks();
  mockNeedRefresh = false;
});

describe('UpdatePrompt', () => {
  it('renders nothing when no update available', () => {
    mockNeedRefresh = false;
    const { container } = render(<UpdatePrompt />);
    expect(screen.queryByText('새로운 버전이 있어요!')).toBeNull();
    // AnimatePresence may leave an empty wrapper
    expect(container.textContent).toBe('');
  });

  it('renders update banner when needRefresh is true', () => {
    mockNeedRefresh = true;
    render(<UpdatePrompt />);
    expect(screen.getByText('새로운 버전이 있어요!')).toBeTruthy();
    expect(screen.getByText('업데이트')).toBeTruthy();
  });

  it('calls updateServiceWorker on update button click', async () => {
    mockNeedRefresh = true;
    render(<UpdatePrompt />);

    await userEvent.click(screen.getByText('업데이트'));
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true);
  });

  it('calls setNeedRefresh(false) on dismiss', async () => {
    mockNeedRefresh = true;
    render(<UpdatePrompt />);

    await userEvent.click(screen.getByLabelText('닫기'));
    expect(mockSetNeedRefresh).toHaveBeenCalledWith(false);
  });
});
