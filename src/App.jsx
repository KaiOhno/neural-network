import { useState, useCallback } from 'react';
import { Brain } from 'lucide-react';
import NodeGraph from './components/NodeGraph';
import TextInput from './components/TextInput';
import AnalysisPanel from './components/AnalysisPanel';
import { createNode, createEdges, calculateNetworkStats } from './utils/nodeManager';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleAddNode = useCallback((text) => {
    const newNode = createNode(text, {
      x: Math.random() * 500,
      y: Math.random() * 300
    });
    
    const newEdges = createEdges(newNode, nodes);
    
    setNodes(prev => [...prev, newNode]);
    setEdges(prev => [...prev, ...newEdges]);
  }, [nodes]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const networkStats = calculateNetworkStats(nodes, edges);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <h1 className="text-xl font-bold">Neural Network Obsidian Brain</h1>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-4">
            <div className="h-[600px]">
              <NodeGraph
                initialNodes={nodes}
                initialEdges={edges}
                onNodeClick={handleNodeClick}
              />
            </div>
            <div className="mt-4">
              <TextInput onSubmit={handleAddNode} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <AnalysisPanel
              selectedNode={selectedNode}
              networkStats={networkStats}
            />
          </div>
        </div>
      </main>

      <footer className="mt-8 bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center text-sm">
          <p>Neural Network Obsidian Brain - Visualize Your Thoughts</p>
        </div>
      </footer>
    </div>
  );
}

export default App;