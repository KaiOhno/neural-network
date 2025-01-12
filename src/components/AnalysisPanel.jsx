import PropTypes from 'prop-types';
import { Brain, Activity } from 'lucide-react';

const AnalysisPanel = ({ selectedNode, networkStats }) => {
  if (!selectedNode && !networkStats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {selectedNode ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Node Analysis</h3>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Content</h4>
            <p className="mt-1 text-sm">{selectedNode.data.fullText}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Keywords</h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {selectedNode.data.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Connections</h4>
            <p className="mt-1 text-sm">
              Connected to {selectedNode.data.connections || 0} nodes
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Network Stats</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Nodes</h4>
              <p className="mt-1 text-xl font-semibold">{networkStats.nodeCount}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Total Connections</h4>
              <p className="mt-1 text-xl font-semibold">{networkStats.edgeCount}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AnalysisPanel.propTypes = {
  selectedNode: PropTypes.shape({
    data: PropTypes.shape({
      fullText: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string),
      connections: PropTypes.number
    })
  }),
  networkStats: PropTypes.shape({
    nodeCount: PropTypes.number,
    edgeCount: PropTypes.number
  })
};

export default AnalysisPanel;