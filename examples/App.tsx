import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { NetworkView } from '../src/lib/Network';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import './index.css';

interface Node {
  id: number | string;
  label: string;
  title: string;
  group: string;
  color?: {
    background?: string;
    border?: string;
  };
}

interface Edge {
  id?: number | string;
  from: number | string;
  to: number | string;
  label?: string;
}

function App() {
  // Network reference
  const networkRef = useRef<Network | null>(null);

  // Initial data representing an Asimov-like protocol knowledge graph
  const initialNodes: Node[] = useMemo(() => [
    { id: 1, label: 'ASIMOV Protocol', title: 'Decentralized AI Protocol', group: 'project' },
    { id: 2, label: 'Governance DAO', title: 'Decentralized Autonomous Organization', group: 'module' },
    { id: 3, label: 'ASI Token', title: 'Governance Token', group: 'token' },
    { id: 4, label: 'AI Models', title: 'ML/AI Models Repository', group: 'protocol' },
    { id: 5, label: 'Data Market', title: 'Decentralized Data Marketplace', group: 'protocol' },
  ], []);

  const initialEdges: Edge[] = useMemo(() => [
    { from: 1, to: 2, label: 'governed by' },
    { from: 1, to: 3, label: 'uses' },
    { from: 2, to: 3, label: 'votes with' },
    { from: 1, to: 4, label: 'hosts' },
    { from: 1, to: 5, label: 'integrates' },
  ], []);

  // State for dynamic data
  const [nodes] = useState<DataSet<Node>>(new DataSet(initialNodes));
  const [edges] = useState<DataSet<Edge>>(new DataSet(initialEdges));
  const [nodeIds, setNodeIds] = useState<(number | string)[]>([2, 3, 4, 5]); // Track removable nodes
  const [shadowState, setShadowState] = useState(false);
  const [isAutoSimulating, setIsAutoSimulating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<number | string | null>(null);

  // Auto simulation interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Node templates for generation
  const nodeTemplates = useMemo(() => [
    { label: 'Smart Contract', group: 'protocol', title: 'Automated Contract Execution' },
    { label: 'Oracle', group: 'module', title: 'External Data Provider' },
    { label: 'Validator', group: 'protocol', title: 'Network Validator Node' },
    { label: 'Bridge', group: 'module', title: 'Cross-chain Bridge' },
    { label: 'Mining Pool', group: 'protocol', title: 'Collective Mining Operation' },
    { label: 'DEX', group: 'protocol', title: 'Decentralized Exchange' },
    { label: 'Liquidity Pool', group: 'token', title: 'Trading Liquidity Provider' },
    { label: 'Reputation System', group: 'module', title: 'Trust Scoring System' },
    { label: 'Analytics Engine', group: 'module', title: 'Data Analytics Service' },
    { label: 'API Gateway', group: 'protocol', title: 'Service Interface Layer' },
  ], []);

  const edgeLabels = useMemo(() => [
    'connects to', 'powered by', 'validates', 'feeds data to', 'secures', 'trades with'
  ], []);

  // Function to generate random node
  const generateRandomNode = useCallback(() => {
    const template = nodeTemplates[Math.floor(Math.random() * nodeTemplates.length)];
    const id = Math.random().toString(36).substr(2, 9);
    return {
      id,
      label: template.label,
      title: template.title,
      group: template.group,
    };
  }, [nodeTemplates]);

  // Add new node with random connection
  const addNode = useCallback(() => {
    const newNode = generateRandomNode();
    const existingNodeIds = nodeIds.length > 0 ? nodeIds : [1];
    const connectToId = existingNodeIds[Math.floor(Math.random() * existingNodeIds.length)];
    const edgeLabel = edgeLabels[Math.floor(Math.random() * edgeLabels.length)];

    nodes.add(newNode);
    edges.add({
      from: newNode.id,
      to: connectToId,
      label: edgeLabel,
    });

    setNodeIds(prev => [...prev, newNode.id]);
  }, [nodes, edges, nodeIds, generateRandomNode, edgeLabels]);

  // Change protocol node color (node 1)
  const changeProtocolNode = useCallback(() => {
    const colors = ['#2c4a7a', '#e65a00', '#5a6d92', '#1a3d6b', '#8b5cf6', '#10b981', '#f59e0b'];
    const newColor = colors[Math.floor(Math.random() * colors.length)];

    nodes.update([{
      id: 1,
      color: {
        background: newColor,
        border: '#2d3748',
      },
    }]);
  }, [nodes]);

  // Remove random node
  const removeRandomNode = useCallback(() => {
    if (nodeIds.length === 0) return;

    const randomIndex = Math.floor(Math.random() * nodeIds.length);
    const nodeToRemove = nodeIds[randomIndex];

    // Remove connected edges first
    const connectedEdges = edges.get({
      filter: (edge: Edge) => edge.from === nodeToRemove || edge.to === nodeToRemove
    });

    edges.remove(connectedEdges.map(edge => edge.id!));
    nodes.remove(nodeToRemove);

    setNodeIds(prev => prev.filter(id => id !== nodeToRemove));
  }, [nodes, edges, nodeIds]);

  // Toggle shadow effects
  const toggleShadows = useCallback(() => {
    setShadowState(prev => {
      const newState = !prev;
      if (networkRef.current) {
        networkRef.current.setOptions({
          nodes: { shadow: newState },
          edges: { shadow: newState },
        });
      }
      return newState;
    });
  }, []);

  // Reset to initial state
  const resetNetwork = useCallback(() => {
    nodes.clear();
    edges.clear();
    nodes.add(initialNodes);
    edges.add(initialEdges);
    setNodeIds([2, 3, 4, 5]);
    setShadowState(false);
  }, [nodes, edges, initialNodes, initialEdges]);

  // Stabilize network
  const stabilizeNetwork = useCallback(() => {
    if (networkRef.current) {
      networkRef.current.stabilize();
    }
  }, []);

  // Auto simulation functions
  const startAutoSimulation = useCallback(() => {
    if (intervalRef.current) return;

    setIsAutoSimulating(true);
    intervalRef.current = setInterval(() => {
      const actions = [addNode, changeProtocolNode];
      // Only add removeRandomNode if we have removable nodes
      if (nodeIds.length > 2) {
        actions.push(removeRandomNode);
      }

      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      randomAction();
    }, 2000);
  }, [addNode, changeProtocolNode, removeRandomNode, nodeIds.length]);

  const stopAutoSimulation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsAutoSimulating(false);
  }, []);

  // Handle network initialization
  const handleNetworkInit = useCallback((network: Network) => {
    networkRef.current = network;
  }, []);

  // Handle node selection
  const handleNodeSelect = useCallback((nodeId: number | string) => {
    setSelectedNodeId(nodeId);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Custom options for the network
  const options = {
    layout: {
      hierarchical: {
        enabled: false,
      }
    },
    physics: {
      stabilization: false,
      barnesHut: {
        gravitationalConstant: -8000,
        springConstant: 0.001,
        springLength: 200,
      },
    },
    interaction: {
      hover: true,
      tooltipDelay: 200,
      navigationButtons: true,
      keyboard: true,
    },
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        alignItems: 'center'
      }}>
        <h2 style={{ margin: 0, marginRight: '20px', color: '#2c4a7a' }}>
          ASIMOV Network Simulation
        </h2>

        <button
          onClick={addNode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Node
        </button>

        <button
          onClick={changeProtocolNode}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Change Protocol
        </button>

        <button
          onClick={removeRandomNode}
          disabled={nodeIds.length === 0}
          style={{
            padding: '8px 16px',
            backgroundColor: nodeIds.length === 0 ? '#6c757d' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: nodeIds.length === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          Remove Node
        </button>

        <button
          onClick={toggleShadows}
          style={{
            padding: '8px 16px',
            backgroundColor: shadowState ? '#ffc107' : '#17a2b8',
            color: shadowState ? 'black' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {shadowState ? 'Disable' : 'Enable'} Shadows
        </button>

        <button
          onClick={stabilizeNetwork}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6f42c1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Stabilize
        </button>

        <button
          onClick={resetNetwork}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>

        <button
          onClick={isAutoSimulating ? stopAutoSimulation : startAutoSimulation}
          style={{
            padding: '8px 16px',
            backgroundColor: isAutoSimulating ? '#dc3545' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isAutoSimulating ? 'Stop' : 'Start'} Auto Simulation
        </button>

        {selectedNodeId && (
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#e9ecef',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#495057'
          }}>
            Selected: {selectedNodeId}
          </div>
        )}

        <div style={{
          padding: '8px 12px',
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          fontSize: '14px',
          color: '#495057'
        }}>
          Nodes: {nodes.length} | Edges: {edges.length}
        </div>
      </div>

      {/* Network Visualization */}
      <div style={{ flex: 1 }}>
        <NetworkView
          data={{ nodes, edges }}
          options={options}
          onNetworkInit={handleNetworkInit}
          onNodeSelect={handleNodeSelect}
        />
      </div>
    </div>
  );
}

export default App;
