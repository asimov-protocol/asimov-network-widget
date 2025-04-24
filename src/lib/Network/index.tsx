import { useEffect, useRef, useCallback, useMemo } from 'react';
import { Network, type Data as NetworkData, type Options as NetworkOptions } from 'vis-network';
import { DataSet } from 'vis-data';
import './styles.css';

// Color configuration for the network
export interface ColorTheme {
  project: string;
  module: string;
  token: string;
  protocol: string;
  border: string;
  font: string;
  edge: string;
  edgeHighlight: string;
}

// Default color theme using the provided color palette
const defaultColorTheme: ColorTheme = {
  project: '#395183',
  module: '#6a7ca2',
  token: '#f37021',
  protocol: '#072564',
  border: '#05122e',
  font: '#f6f6f6',
  edge: '#818181',
  edgeHighlight: '#395183',
};

export interface NetworkViewProps {
  data?: NetworkData;
  options?: NetworkOptions;
  colorTheme?: Partial<ColorTheme>;
  onNetworkInit?: (network: Network) => void;
  onNodeSelect?: (nodeId: number | string, params: {nodes: Array<number | string>}) => void; // Add this callback
}

export const NetworkView: React.FC<NetworkViewProps> = ({
  data,
  options = {},
  colorTheme = {},
  onNetworkInit,
  onNodeSelect
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  const theme = useMemo<ColorTheme>(() => ({ ...defaultColorTheme, ...colorTheme }), [colorTheme]);

  const handleNodeSelect = useCallback((params: {nodes: Array<number | string>}) => {
    if (params.nodes.length > 0) {
      const nodeId = params.nodes[0];

      if (onNodeSelect) {
        onNodeSelect(nodeId, params);
      }
    }
  }, [onNodeSelect]);

  const handleDoubleClick = useCallback((params: {nodes: Array<number | string>}) => {
    if (params.nodes.length > 0 && networkRef.current) {
      console.log('Node double-clicked:', params.nodes[0]);
      networkRef.current.focus(params.nodes[0], {
        scale: 1.2,
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || ! data) return;

    const getNodeColor = (group?: string): string => {
      switch (group) {
        case 'project': return theme.project;
        case 'module': return theme.module;
        case 'token': return theme.token;
        default: return theme.protocol;
      }
    };

    const nodes = new DataSet(
      data.nodes?.map(node => ({
        ...node,
        shape: node.group === 'project' ? 'hexagon' :
               node.group === 'module' ? 'box' :
               node.group === 'token' ? 'diamond' : 'ellipse',
        color: {
          background: getNodeColor(node.group as string),
          border: theme.border,
          highlight: {
            background: '#b5bed1',
            border: theme.border
          }
        },
        font: { color: theme.font },
        size: node.group === 'project' ? 30 : 20,
      })) || []
    );

    const getEdgeLength = (label?: string): number => {
      switch (label) {
        case 'implements': return 300;
        case 'utilizes': return 280;
        case 'traded on': return 350;
        case 'staked in': return 320;
        case 'controls': return 250;
        default: return 300;
      }
    };

    const edges = new DataSet(
      data.edges?.map(edge => ({
        ...edge,
        arrows: 'to',
        color: { color: theme.edge, highlight: theme.edgeHighlight },
        width: 1.5,
        font: { size: 10, color: theme.edge },
        length: getEdgeLength(edge.label),
      })) || []
    );

    // Default network options
    const defaultOptions: NetworkOptions = {
      interaction: {
        hover: true,
        tooltipDelay: 200,
        navigationButtons: true,
        keyboard: true,
      },
    };

    // Create the network
    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      { ...defaultOptions, ...options }
    );

    if (onNetworkInit && networkRef.current) {
      onNetworkInit(networkRef.current);
    }

    // Add event listeners
    networkRef.current.on('selectNode', handleNodeSelect);
    networkRef.current.on('doubleClick', handleDoubleClick);

    // Clean up
    return () => {
      if (networkRef.current) {
        networkRef.current.off('selectNode', handleNodeSelect);
        networkRef.current.off('doubleClick', handleDoubleClick);
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [data, options, handleNodeSelect, handleDoubleClick, theme, onNetworkInit]);

  return (
    <div className="network-widget">
      <div className="network-container" ref={containerRef} />
    </div>
  );
};
