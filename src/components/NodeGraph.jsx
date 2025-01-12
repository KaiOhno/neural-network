import PropTypes from 'prop-types';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Node from './Node';

const nodeTypes = {
  custom: Node,
};

const NodeGraph = ({ initialNodes = [], initialEdges = [], onNodeClick }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => {
    setEdges((eds) => addEdge({ ...params, animated: true }, eds));
  };

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background 
          gap={20} 
          color="#999" 
          variant="dots"
        />
        <Controls 
          position="bottom-left"
          showInteractive={false}
        />
        <MiniMap 
          nodeColor={(node) => {
            return node.selected ? '#6366f1' : '#64748b';
          }}
          maskColor="rgba(0, 0, 0, 0.2)"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
      </ReactFlow>
    </div>
  );
};

NodeGraph.propTypes = {
  initialNodes: PropTypes.arrayOf(PropTypes.object),
  initialEdges: PropTypes.arrayOf(PropTypes.object),
  onNodeClick: PropTypes.func
};

export default NodeGraph;