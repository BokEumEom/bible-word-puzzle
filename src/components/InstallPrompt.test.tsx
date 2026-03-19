import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstallPrompt } from './InstallPrompt';
import * as useInstallPromptModule from '../hooks/useInstallPrompt';

const defaultState: useInstallPromptModule.InstallPromptState = {
  canInstall: false,
  isIOS: false,
  isStandalone: false,
  isDismissedByUser: false,
  promptInstall: vi.fn(),
  dismiss: vi.fn(),
};

function mockInstallPrompt(overrides: Partial<useInstallPromptModule.InstallPromptState> = {}) {
  return vi.spyOn(useInstallPromptModule, 'useInstallPrompt').mockReturnValue({
    ...defaultState,
    ...overrides,
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe('InstallPrompt', () => {
  it('renders nothing when standalone', () => {
    mockInstallPrompt({ isStandalone: true });
    const { container } = render(<InstallPrompt />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when dismissed', () => {
    mockInstallPrompt({ isDismissedByUser: true, canInstall: true });
    const { container } = render(<InstallPrompt />);
    expect(container.innerHTML).toBe('');
  });

  it('renders nothing when not installable and not iOS', () => {
    mockInstallPrompt();
    const { container } = render(<InstallPrompt />);
    expect(container.innerHTML).toBe('');
  });

  it('renders Android install button when canInstall', () => {
    mockInstallPrompt({ canInstall: true });
    render(<InstallPrompt />);
    expect(screen.getByText('설치하기')).toBeTruthy();
    expect(screen.getByText('홈 화면에 추가하세요!')).toBeTruthy();
  });

  it('renders iOS instructions when isIOS', () => {
    mockInstallPrompt({ isIOS: true });
    render(<InstallPrompt />);
    expect(screen.getByText('홈 화면에 추가하세요!')).toBeTruthy();
    expect(screen.getByText(/공유 버튼/)).toBeTruthy();
  });

  it('calls promptInstall on install button click', async () => {
    const promptInstall = vi.fn();
    mockInstallPrompt({ canInstall: true, promptInstall });
    render(<InstallPrompt />);

    await userEvent.click(screen.getByText('설치하기'));
    expect(promptInstall).toHaveBeenCalled();
  });

  it('calls dismiss on close button click', async () => {
    const dismiss = vi.fn();
    mockInstallPrompt({ canInstall: true, dismiss });
    render(<InstallPrompt />);

    await userEvent.click(screen.getByLabelText('닫기'));
    expect(dismiss).toHaveBeenCalled();
  });
});
