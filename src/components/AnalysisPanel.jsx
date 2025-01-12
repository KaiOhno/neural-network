import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { 
  Brain, 
  Activity, 
  Download, 
  Upload,
  FileText, 
  Share2, 
  Edit3, 
  Hash, 
  Link as LinkIcon,
  Save,
  Trash2,
  Plus,
  RefreshCw
} from 'lucide-react';
import { exportToImage, exportToPDF, saveNetworkData, loadNetworkData } from '../utils/exportUtils';
import { toast } from 'react-hot-toast';

const AnalysisPanel = ({ 
  selectedNode, 
  networkStats, 
  darkMode, 
  nodes,
  edges,
  onUpdateNode,
  reactFlowInstance
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const fileInputRef = useRef(null);
  const [editingKeywords, setEditingKeywords] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleExportImage = async () => {
    const result = await exportToImage(reactFlowInstance, darkMode);
    if (result) {
      toast.success('Image exported successfully!');
    } else {
      toast.error('Failed to export image');
    }
  };

  const handleExportPDF = async () => {
    await exportToPDF(reactFlowInstance, darkMode, nodes, edges, networkStats);
    toast.success('PDF exported successfully!');
  };

  const handleSaveNetwork = () => {
    saveNetworkData(nodes, edges);
    toast.success('Network data saved successfully!');
  };

  const handleLoadNetwork = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await loadNetworkData(file);
      // Implement the loading logic here with your state management
      toast.success('Network data loaded successfully!');
    } catch (error) {
      toast.error('Failed to load network data');
    }
  };

  const handleSaveEdit = () => {
    if (selectedNode && editedText.trim()) {
      onUpdateNode(selectedNode.id, { fullText: editedText });
      setIsEditing(false);
      toast.success('Node updated successfully!');
    }
  };

  const handleAddKeyword = () => {
    if (selectedNode && newKeyword.trim()) {
      const updatedKeywords = [
        ...(selectedNode.data.keywords || []),
        newKeyword.trim()
      ];
      onUpdateNode(selectedNode.id, { keywords: updatedKeywords });
      setNewKeyword('');
      toast.success('Keyword added successfully!');
    }
  };

  const handleRemoveKeyword = (keyword) => {
    if (selectedNode) {
      const updatedKeywords = selectedNode.data.keywords.filter(k => k !== keyword);
      onUpdateNode(selectedNode.id, { keywords: updatedKeywords });
      toast.success('Keyword removed successfully!');
    }
  };

  if (!networkStats) return null;

  return (
    <div className={`h-full flex flex-col ${
      darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
    }`}>
      {/* Stats Header */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Activity className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
            Network Overview
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportImage}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Export as Image"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={handleExportPDF}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Export as PDF"
            >
              <FileText size={16} />
            </button>
            <button
              onClick={handleSaveNetwork}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Save Network"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Load Network"
            >
              <Upload size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLoadNetwork}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-sm text-gray-500">Nodes</div>
            <div className="text-2xl font-bold">{networkStats.nodeCount}</div>
          </div>
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="text-sm text-gray-500">Connections</div>
            <div className="text-2xl font-bold">{networkStats.edgeCount}</div>
          </div>
        </div>
      </div>

      {/* Node Details */}
      <div className="flex-1 overflow-y-auto p-4">
        {selectedNode ? (
          <div className="space-y-4">
            {/* Content Section */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Content</h3>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setEditedText(selectedNode.data.fullText);
                  }}
                  className={`p-1.5 rounded-md transition-colors ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  <Edit3 size={16} />
                </button>
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className={`w-full p-2 rounded-md min-h-[100px] ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-200' 
                        : 'bg-white text-gray-800'
                    }`}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded-md bg-gray-500 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{selectedNode.data.fullText}</p>
              )}
            </div>

{/* Keywords Section */}
<div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Keywords</h3>
                <button
                  onClick={() => setEditingKeywords(!editingKeywords)}
                  className={`p-1.5 rounded-md transition-colors ${
                    darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                  }`}
                >
                  {editingKeywords ? <RefreshCw size={16} /> : <Edit3 size={16} />}
                </button>
              </div>

              <div className="space-y-2">
                {editingKeywords && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add new keyword..."
                      className={`flex-1 p-2 rounded-md text-sm ${
                        darkMode 
                          ? 'bg-gray-800 text-gray-200' 
                          : 'bg-white text-gray-800'
                      }`}
                    />
                    <button
                      onClick={handleAddKeyword}
                      className="p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {selectedNode.data.keywords?.map((keyword, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        darkMode 
                          ? 'bg-gray-600 text-gray-200' 
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <span className="text-sm">{keyword}</span>
                      {editingKeywords && (
                        <button
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="p-0.5 hover:text-red-500 rounded-full"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connections Section */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Connected Nodes</h3>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedNode.data.connections || 0} connection(s)
                </span>
              </div>
              
              <div className="space-y-2">
                {edges
                  .filter(edge => edge.source === selectedNode.id || edge.target === selectedNode.id)
                  .map((edge, index) => {
                    const connectedNode = nodes.find(node => 
                      node.id === (edge.source === selectedNode.id ? edge.target : edge.source)
                    );
                    return (
                      <div
                        key={index}
                        className={`p-2 rounded-md text-sm ${
                          darkMode ? 'bg-gray-800' : 'bg-gray-200'
                        }`}
                      >
                        {connectedNode?.data.label}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Activity className={`h-12 w-12 mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Select a node to view details
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

AnalysisPanel.propTypes = {
  selectedNode: PropTypes.shape({
    id: PropTypes.string,
    data: PropTypes.shape({
      fullText: PropTypes.string,
      keywords: PropTypes.arrayOf(PropTypes.string),
      connections: PropTypes.number,
      label: PropTypes.string
    })
  }),
  networkStats: PropTypes.shape({
    nodeCount: PropTypes.number,
    edgeCount: PropTypes.number
  }),
  darkMode: PropTypes.bool,
  nodes: PropTypes.array,
  edges: PropTypes.array,
  onUpdateNode: PropTypes.func,
  reactFlowInstance: PropTypes.object
};

export default AnalysisPanel;


