import { useState, useCallback, useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TextInput from './components/TextInput';
import AnalysisPanel from './components/AnalysisPanel';
import CustomNode from './components/Node';
import { createNode, createEdges, calculateNetworkStats } from './utils/nodeManager';
import { Toaster, toast } from 'react-hot-toast';
import { useTheme } from './context/ThemeContext';

const nodeTypes = {
  custom: CustomNode
};

function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onInit = useCallback((instance) => {
    setReactFlowInstance(instance);
  }, []);

  const handleAddNode = useCallback((text, customTags = []) => {
    if (!reactFlowInstance) return;

    // Get the viewport center
    const { x: viewX, y: viewY, zoom } = reactFlowInstance.getViewport();
    const centerX = (reactFlowWrapper.current.offsetWidth / 2 - viewX) / zoom;
    const centerY = (reactFlowWrapper.current.offsetHeight / 2 - viewY) / zoom;

    // Add some random offset from the center
    const position = {
      x: centerX + (Math.random() - 0.5) * 300,
      y: centerY + (Math.random() - 0.5) * 200,
    };

    const newNode = createNode(text, position);
    if (customTags.length > 0) {
      newNode.data.keywords = [...new Set([...newNode.data.keywords, ...customTags])];
    }

    setNodes((nds) => [...nds, newNode]);

    // Create edges with existing nodes
    const newEdges = createEdges(newNode, nodes);
    if (newEdges.length > 0) {
      setEdges((eds) => [...eds, ...newEdges]);
    }

    toast.success('Node added successfully!', {
      style: {
        background: darkMode ? '#1F2937' : '#ffffff',
        color: darkMode ? '#ffffff' : '#000000',
      }
    });
  }, [nodes, darkMode, reactFlowInstance, setNodes, setEdges]);

  const onNodeDragStop = useCallback((event, node) => {
    // Update node position after drag
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            position: node.position,
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const handleNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const networkStats = calculateNetworkStats(nodes, edges);

  return (
    <div className={`h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Toaster position="top-right" />
      
      <div className="h-full flex">
        {/* Main Flow Area */}
        <div ref={reactFlowWrapper} className="flex-1 h-full relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={onInit}
            onNodeClick={handleNodeClick}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            className={darkMode ? 'bg-gray-900' : 'bg-gray-50'}
          >
            <Background 
              color={darkMode ? '#4B5563' : '#E5E7EB'} 
              gap={16} 
              variant={darkMode ? 'dots' : 'lines'} 
            />
            <Controls 
              className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
              position="bottom-left"
              showInteractive={false}
            />
            <MiniMap 
              className={darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              nodeColor={darkMode ? '#4B5563' : '#E5E7EB'}
              maskColor={darkMode ? 'rgba(17, 24, 39, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
            />
            <Panel position="top-right">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg ${
                  darkMode 
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                } shadow-lg transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </Panel>
          </ReactFlow>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[600px] max-w-[90%]">
            <TextInput onSubmit={handleAddNode} darkMode={darkMode} />
          </div>
        </div>

        {/* Analysis Panel */}
        <div className="w-96 h-full border-l border-gray-700">
          <AnalysisPanel
            selectedNode={selectedNode}
            networkStats={networkStats}
            darkMode={darkMode}
            nodes={nodes}
            edges={edges}
            onUpdateNode={(id, newData) => {
              setNodes(nodes.map(node => 
                node.id === id 
                  ? { ...node, data: { ...node.data, ...newData } }
                  : node
              ));
            }}
            reactFlowInstance={reactFlowInstance}
          />
        </div>
      </div>
    </div>
  );
}

export default App;