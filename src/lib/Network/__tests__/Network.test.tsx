import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { NetworkView } from '../index';
import { Network, Data as NetworkData, Options as NetworkOptions } from 'vis-network';

// Create spy functions for the Network methods
const onSpy = vi.fn();
const offSpy = vi.fn();
const focusSpy = vi.fn();
const destroySpy = vi.fn();

// Mock vis-network
vi.mock('vis-network', () => {
  const Network = vi.fn(() => ({
    on: onSpy,
    off: offSpy,
    focus: focusSpy,
    destroy: destroySpy,
  }));

  return {
    Network,
  };
});

// Mock vis-data
vi.mock('vis-data', () => {
  const DataSet = vi.fn((data) => ({
    get: vi.fn(() => data),
    map: vi.fn((callback) => (data ? data.map(callback) : [])),
  }));

  return {
    DataSet,
  };
});

describe('NetworkView Component', () => {
  const mockData: NetworkData = {
    nodes: [
      { id: 1, label: 'ASIMOV Protocol', group: 'project' },
      { id: 2, label: 'Governance', group: 'module' },
      { id: 3, label: 'Token', group: 'token' },
      { id: 4, label: 'DEX', group: 'protocol' },
    ],
    edges: [
      { from: 1, to: 2, label: 'governed by' },
      { from: 1, to: 3, label: 'uses' },
      { from: 3, to: 4, label: 'traded on' },
    ],
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<NetworkView data={mockData} />);
    const widgetElement = container.querySelector('.network-widget');
    expect(widgetElement).not.toBeNull();
  });

  it('initializes Network with provided data', () => {
    render(<NetworkView data={mockData} />);
    expect(Network).toHaveBeenCalledTimes(1);
  });

  it('applies custom options when provided', () => {
    const customOptions: NetworkOptions = {
      physics: {
        enabled: false
      }
    };

    render(<NetworkView data={mockData} options={customOptions} />);

    // Check that Network was called with options that include our custom options
    const networkCallArgs = (Network as unknown as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(networkCallArgs[2]).toMatchObject(customOptions);
  });

  it('calls onNetworkInit callback with network instance', () => {
    const onNetworkInit = vi.fn();
    render(<NetworkView data={mockData} onNetworkInit={onNetworkInit} />);

    expect(onNetworkInit).toHaveBeenCalledTimes(1);
    expect(onNetworkInit.mock.calls[0][0]).toBeDefined();
  });

  it('applies custom color theme when provided', () => {
    const customColorTheme = {
      project: '#ff0000',
      token: '#00ff00'
    };

    const { container } = render(
      <NetworkView data={mockData} colorTheme={customColorTheme} />
    );

    // Verify it renders without errors
    const widgetElement = container.querySelector('.network-widget');
    expect(widgetElement).not.toBeNull();
  });

  it('calls onNodeSelect when a node is selected', () => {
    const onNodeSelect = vi.fn();
    render(<NetworkView data={mockData} onNodeSelect={onNodeSelect} />);

    // Find the selectNode callback (first arg is 'selectNode')
    const selectNodeCall = onSpy.mock.calls.find(call => call[0] === 'selectNode');

    if (!selectNodeCall) {
      throw new Error('selectNode event handler was not registered');
    }

    const selectNodeCallback = selectNodeCall[1];

    // Simulate a node selection event
    selectNodeCallback({ nodes: [1] });

    // Check that our callback was called with the right parameters
    expect(onNodeSelect).toHaveBeenCalledTimes(1);
    expect(onNodeSelect).toHaveBeenCalledWith(1, { nodes: [1] });
  });

  it('cleans up network resources on unmount', () => {
    const { unmount } = render(<NetworkView data={mockData} />);

    // Unmount the component
    unmount();

    // Check that destroy was called
    expect(destroySpy).toHaveBeenCalledTimes(1);

    // Check that event listeners were removed
    expect(offSpy).toHaveBeenCalled();
    // We expect calls for at least selectNode and doubleClick events
    expect(offSpy.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('handles the case when no data is provided', () => {
    // Should render without errors even without data
    const { container } = render(<NetworkView />);
    const widgetElement = container.querySelector('.network-widget');
    expect(widgetElement).not.toBeNull();
  });
});
