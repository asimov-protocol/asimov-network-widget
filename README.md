# ASIMOV Network Widget

A React component for visualizing network graphs in Asimov Protocol applications with customizable styling to match the Asimov design system.

<img width="805" alt="ASIMOV Network Widget" src="https://github.com/user-attachments/assets/c753407e-e2e4-4da9-9504-b1a4b6dcb1d0" />


### Overview

The ASIMOV Network Widget provides a configurable network visualization using the [vis-network](https://github.com/visjs/vis-network) library, designed to integrate seamlessly with Asimov Protocol applications. The widget allows developers to create interactive network graphs with nodes and edges, visualizing relationships between protocol components.

### Features

- Interactive network graph visualization
- Customizable node types based on groups (project, module, token, protocol)
- Distinctive node shapes and colors matching Asimov design system
- Configurable edge length and styling
- Node selection and double-click focus interactions
- Completely customizable through props
- TypeScript support with proper type definitions

> **Note:** This package isn’t published to npm. You can install it directly from GitHub.

### Installation

```bash
npm install --save git+https://github.com/asimov-protocol/asimov-network-widget.git
```

### Basic Usage

```tsx
import { NetworkView } from 'asimov-network-widget';
import 'asimov-network-widget/dist/asimov-network-widget.css'

function App() {
  // Sample data representing protocol knowledge graph
  const graphData = {
    nodes: [
      { id: 1, label: 'ASIMOV Protocol', title: 'Main Protocol', group: 'project' },
      { id: 2, label: 'Governance', title: 'DAO Governance', group: 'module' },
      { id: 3, label: 'ASI Token', title: 'Governance Token', group: 'token' },
      { id: 4, label: 'DEX', title: 'Decentralized Exchange', group: 'protocol' },
    ],
    edges: [
      { from: 1, to: 2, label: 'governed by' },
      { from: 1, to: 3, label: 'uses' },
      { from: 2, to: 3, label: 'votes with' },
      { from: 3, to: 4, label: 'traded on' },
    ]
  };

  // Custom options for the network
  const options = {
    layout: {
      hierarchical: {
        enabled: false,
      }
    }
  };

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <NetworkView
        data={graphData}
        options={options}
      />
    </div>
  );
}
```

### Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `NetworkData` | Sample data | Network data with nodes and edges |
| `options` | `NetworkOptions` | `{}` | Configuration options for vis-network |
| `colorTheme` | `Partial<ColorTheme>` | Default theme | Custom color theme for the network |
| `onNetworkInit` | `(network: Network) => void` | - | Callback when network is initialized |
| `onNodeSelect` | `(nodeId: string \| number, params: object) => void` | - | Callback when node is selected |

### Styling

The NetworkView component uses a default color theme that follows the Asimov design system:

```ts
const defaultColorTheme = {
  project: '#395183',
  module: '#6a7ca2',
  token: '#f37021',
  protocol: '#072564',
  border: '#05122e',
  font: '#f6f6f6',
  edge: '#818181',
  edgeHighlight: '#395183',
};
```

You can override any of these colors by providing a `colorTheme` prop:

```tsx
<NetworkView
  data={graphData}
  colorTheme={{
    token: '#ff0000',
    edge: '#cccccc'
  }}
/>
```

### Advanced Configuration

You can pass any vis-network options to customize the network behavior:

```tsx
const options = {
  physics: {
    solver: 'forceAtlas2Based',
    forceAtlas2Based: {
      gravitationalConstant: -40,
      centralGravity: 0.008,
      springLength: 250,
      springConstant: 0.04,
    },
  },
  layout: {
    improvedLayout: true,
  }
};

<NetworkView
  data={graphData}
  options={options}
/>
```

## Local Development

If you’d like to work with this repository directly, simply clone it and install its dependencies. Then, you can spin up the development server with the following commands:

```bash
git clone https://github.com/asimov-protocol/asimov-network-widget.git
cd asimov-network-widget
nvm use # optional
npm install
npm run dev
```
