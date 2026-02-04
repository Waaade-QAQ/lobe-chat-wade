import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Nav from './Nav';

// Mock store
const mockOpenNewTopicOrSaveTopic = vi.fn();
const mockSwitchTopic = vi.fn();
const mockToggleCommandMenu = vi.fn();

vi.mock('@/store/chat', () => ({
  useChatStore: (selector: any) => {
    const state = {
      openNewTopicOrSaveTopic: mockOpenNewTopicOrSaveTopic,
      switchTopic: mockSwitchTopic,
    };
    return selector(state);
  },
}));

vi.mock('@/store/global', () => ({
  useGlobalStore: (selector: any) => {
    const state = {
      toggleCommandMenu: mockToggleCommandMenu,
    };
    return selector(state);
  },
}));

vi.mock('@/store/agent', () => ({
  useAgentStore: () => false, // isInbox
}));

vi.mock('@/store/agent/selectors', () => ({
  builtinAgentSelectors: {
    isInboxAgent: () => false,
  },
}));

vi.mock('@/store/serverConfig', () => ({
  useServerConfigStore: () => ({ isAgentEditable: true }),
  featureFlagsSelectors: (s: any) => s,
}));

// Mock router hooks
vi.mock('react-router-dom', () => ({
  useParams: () => ({ aid: 'agent-id' }),
}));

vi.mock('@/libs/router/navigation', () => ({
  usePathname: () => '/agent/agent-id',
}));

const mockPush = vi.fn();
vi.mock('@/hooks/useQueryRoute', () => ({
  useQueryRoute: () => ({
    push: mockPush,
  }),
}));

// Mock i18n
vi.mock('react-i18next', () => ({
  useTranslation: (ns: string) => ({
    t: (key: string) => `${ns}:${key}`,
  }),
}));

// Mock child components
vi.mock('@/features/NavPanel/components/NavItem', () => ({
  default: ({ title, onClick, loading }: any) => (
    <button onClick={onClick} disabled={loading} data-testid="nav-item">
      {loading ? 'Loading...' : title}
    </button>
  ),
}));

describe('Nav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call openNewTopicOrSaveTopic when new topic button is clicked', async () => {
    mockOpenNewTopicOrSaveTopic.mockResolvedValue(undefined);

    render(<Nav />);

    const newTopicButton = screen.getByText('topic:actions.addNewTopic');

    // Click the button
    await act(async () => {
      fireEvent.click(newTopicButton);
    });

    // Assert function call
    expect(mockOpenNewTopicOrSaveTopic).toHaveBeenCalled();
  });

  it('should show loading state during async operation', async () => {
    // Create a promise that we can control
    let resolvePromise: (value: void) => void;
    const promise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });

    mockOpenNewTopicOrSaveTopic.mockReturnValue(promise);

    render(<Nav />);

    const newTopicButton = screen.getByText('topic:actions.addNewTopic');

    // Click button
    fireEvent.click(newTopicButton);

    // Should be in loading state immediately
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Resolve the promise
    await act(async () => {
      resolvePromise!();
    });

    // Should return to normal state
    await waitFor(() => {
      expect(screen.getByText('topic:actions.addNewTopic')).toBeInTheDocument();
    });
  });
});
