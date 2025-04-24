import { useState } from 'react';
import { NetworkView } from '../src/lib/Network';
import './index.css';

function App() {
  // Sample data representing an Asimov-like protocol knowledge graph
  const [graphData] = useState({
    nodes: [
      { id: 1, label: 'ASIMOV Protocol', title: 'Decentralized AI Protocol', group: 'project' },
      { id: 2, label: 'Governance DAO', title: 'Decentralized Autonomous Organization', group: 'module' },
      { id: 3, label: 'ASI Token', title: 'Governance Token', group: 'token' },
      { id: 4, label: 'AI Models', title: 'ML/AI Models Repository', group: 'protocol' },
      { id: 5, label: 'Data Market', title: 'Decentralized Data Marketplace', group: 'protocol' },
      { id: 6, label: 'Compute Layer', title: 'Distributed Compute Network', group: 'module' },
      { id: 7, label: 'Staking', title: 'Token Staking Protocol', group: 'protocol' },
      { id: 8, label: 'Rewards Pool', title: 'Incentive Distribution', group: 'module' },
    ],
    edges: [
      { from: 1, to: 2, label: 'governed by' },
      { from: 1, to: 3, label: 'uses' },
      { from: 2, to: 3, label: 'votes with' },
      { from: 1, to: 4, label: 'hosts' },
      { from: 1, to: 5, label: 'integrates' },
      { from: 4, to: 5, label: 'sources from' },
      { from: 1, to: 6, label: 'runs on' },
      { from: 4, to: 6, label: 'executed on' },
      { from: 3, to: 7, label: 'staked in' },
      { from: 7, to: 8, label: 'funds' },
      { from: 8, to: 6, label: 'incentivizes' },
    ]
  });

  // Custom options for the network
  const options = {
    layout: {
      hierarchical: {
        enabled: false,
      }
    }
  };

  return (
    <NetworkView
      data={graphData}
      options={options}
    />
  );
}

export default App;
