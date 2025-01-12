import PropTypes from 'prop-types';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge
} from 'react-flow-renderer';
import Node from './Node';

const nodeTypes = {
  custom: Node,
};

const NodeGraph = ({ initialNodes = [], initialEdges = [] }) => {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

NodeGraph.propTypes = {
  initialNodes: PropTypes.arrayOf(PropTypes.object),
  initialEdges: PropTypes.arrayOf(PropTypes.object)
};

export default NodeGraph;