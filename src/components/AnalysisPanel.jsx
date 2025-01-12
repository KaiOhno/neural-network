import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { 
  Activity, 
  FileText, 
  Share2, 
  Edit3, 
  Hash, 
  Save,
  Trash2,
  Plus,
  Search,
  Palette,
  Tag,
  Calendar,
  Clock,
  Link as LinkIcon,
  Star,
  AlertCircle,
  FileDown,
  MoreHorizontal,
  PenTool,
  Image
} from 'lucide-react';
import { exportToImage, exportToPDF, saveNetworkData, loadNetworkData } from '../utils/exportUtils';
import { toast } from 'react-hot-toast';

const NODE_COLORS = [
  { name: 'Blue', bg: 'bg-blue-500', text: 'text-white', hover: 'hover:bg-blue-600' },
  { name: 'Purple', bg: 'bg-purple-500', text: 'text-white', hover: 'hover:bg-purple-600' },
  { name: 'Green', bg: 'bg-green-500', text: 'text-white', hover: 'hover:bg-green-600' },
  { name: 'Red', bg: 'bg-red-500', text: 'text-white', hover: 'hover:bg-red-600' },
  { name: 'Yellow', bg: 'bg-yellow-400', text: 'text-black', hover: 'hover:bg-yellow-500' },
  { name: 'Orange', bg: 'bg-orange-500', text: 'text-white', hover: 'hover:bg-orange-600' },
  { name: 'Teal', bg: 'bg-teal-500', text: 'text-white', hover: 'hover:bg-teal-600' },
  { name: 'Pink', bg: 'bg-pink-500', text: 'text-white', hover: 'hover:bg-pink-600' }
];

const NODE_PRIORITIES = [
  { value: 'high', label: 'High', color: 'bg-red-500' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
  { value: 'low', label: 'Low', color: 'bg-green-500' }
];

const AnalysisPanel = ({ 
  selectedNode, 
  networkStats, 
  darkMode, 
  nodes,
  edges,
  onUpdateNode,
  reactFlowInstance,
  onDeleteNode
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [nodeNotes, setNodeNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [nodePriority, setNodePriority] = useState('medium');

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
      toast.success('Network data loaded successfully!');
    } catch (error) {
      toast.error('Failed to load network data');
    }
  };

  const handleUpdateNodeStyle = (color) => {
    if (!selectedNode) return;
    
    onUpdateNode(selectedNode.id, {
      style: {
        ...selectedNode.data.style,
        backgroundColor: color.bg,
        color: color.text
      }
    });
    setShowColorPicker(false);
    toast.success('Node style updated!');
  };

  const handleUpdateNodePriority = (priority) => {
    if (!selectedNode) return;
    onUpdateNode(selectedNode.id, { priority });
    toast.success('Priority updated!');
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;
    if (window.confirm('Are you sure you want to delete this node?')) {
      onDeleteNode(selectedNode.id);
      toast.success('Node deleted!');
    }
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Search Bar */}
      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-gray-100 placeholder-gray-400' 
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-2 p-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="text-xs opacity-70">Nodes</div>
          <div className="text-lg font-bold">{networkStats.nodeCount}</div>
        </div>
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="text-xs opacity-70">Connections</div>
          <div className="text-lg font-bold">{networkStats.edgeCount}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-4 mb-4">
        <button
          onClick={handleExportImage}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Export as Image"
        >
          <Image size={16} />
        </button>
        <button
          onClick={handleExportPDF}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Export as PDF"
        >
          <FileText size={16} />
        </button>
        <button
          onClick={handleSaveNetwork}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Save Network"
        >
          <Save size={16} />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded-lg flex items-center gap-1 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title="Load Network"
        >
          <FileDown size={16} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLoadNetwork}
          accept=".json"
          className="hidden"
        />
      </div>

      {/* Node Details */}
      {selectedNode ? (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Node Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className={darkMode ? 'text-purple-400' : 'text-purple-600'} size={20} />
                <h3 className="text-lg font-semibold">Node Details</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`p-1.5 rounded-md transition-colors ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  title="Change Color"
                >
                  <Palette size={16} />
                </button>
                <button
                  onClick={handleDeleteNode}
                  className="p-1.5 rounded-md text-red-500 hover:bg-red-100/10"
                  title="Delete Node"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Color Picker */}
            {showColorPicker && (
              <div className="grid grid-cols-4 gap-2 p-2 rounded-lg bg-gray-700">
                {NODE_COLORS.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleUpdateNodeStyle(color)}
                    className={`${color.bg} ${color.text} p-2 rounded-lg ${color.hover}`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            )}

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <div className="flex gap-2">
                {NODE_PRIORITIES.map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => handleUpdateNodePriority(priority.value)}
                    className={`px-3 py-1 rounded-lg text-sm ${priority.color} ${
                      nodePriority === priority.value ? 'ring-2 ring-white' : ''
                    }`}
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Content</h4>
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
                      onClick={() => {
                        onUpdateNode(selectedNode.id, { fullText: editedText });
                        setIsEditing(false);
                        toast.success('Content updated!');
                      }}
                      className="px-3 py-1 rounded-md bg-blue-500 text-white"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{selectedNode.data.fullText}</p>
              )}
            </div>

            {/* Keywords */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Keywords</h4>
                <div className="flex">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add keyword..."
                    className={`text-sm px-2 py-1 rounded-md mr-2 ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-200' 
                        : 'bg-white text-gray-800'
                    }`}
                  />
                  <button
                    onClick={() => {
                      if (newKeyword.trim()) {
                        onUpdateNode(selectedNode.id, {
                          keywords: [...(selectedNode.data.keywords || []), newKeyword.trim()]
                        });
                        setNewKeyword('');
                        toast.success('Keyword added!');
                      }
                    }}
                    className="p-1.5 rounded-md bg-blue-500 text-white"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedNode.data.keywords?.map((keyword, index) => (
                  <span
                    key={index}
                    className={`group flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      darkMode 
                      ? 'bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {keyword}
                  <button
                    onClick={() => {
                      onUpdateNode(selectedNode.id, {
                        keywords: selectedNode.data.keywords.filter(k => k !== keyword)
                      });
                      toast.success('Keyword removed!');
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-500"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <PenTool size={16} />
              Notes
            </h4>
            <textarea
              value={nodeNotes}
              onChange={(e) => {
                setNodeNotes(e.target.value);
                onUpdateNode(selectedNode.id, { notes: e.target.value });
              }}
              placeholder="Add notes about this node..."
              className={`w-full p-2 rounded-md min-h-[100px] text-sm ${
                darkMode 
                  ? 'bg-gray-800 text-gray-200 placeholder-gray-500' 
                  : 'bg-white text-gray-800 placeholder-gray-400'
              }`}
            />
          </div>

          {/* Connected Nodes */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <LinkIcon size={16} />
              Connected Nodes ({
                edges.filter(edge => 
                  edge.source === selectedNode.id || 
                  edge.target === selectedNode.id
                ).length
              })
            </h4>
            <div className="space-y-2">
              {edges
                .filter(edge => 
                  edge.source === selectedNode.id || 
                  edge.target === selectedNode.id
                )
                .map((edge, index) => {
                  const connectedNode = nodes.find(node => 
                    node.id === (edge.source === selectedNode.id ? edge.target : edge.source)
                  );
                  if (!connectedNode) return null;
                  return (
                    <button
                      key={index}
                      onClick={() => {
                        const node = nodes.find(n => n.id === connectedNode.id);
                        if (node) {
                          reactFlowInstance.setCenter(
                            node.position.x,
                            node.position.y,
                            { duration: 800 }
                          );
                        }
                      }}
                      className={`w-full p-2 rounded-md text-left text-sm transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 hover:bg-gray-600' 
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      {connectedNode.data.label}
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Advanced Options */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="flex items-center justify-between w-full"
            >
              <span className="font-medium flex items-center gap-2">
                <MoreHorizontal size={16} />
                Advanced Options
              </span>
              <span className={`transform transition-transform ${
                showAdvancedOptions ? 'rotate-180' : ''
              }`}>
                ▼
              </span>
            </button>

            {showAdvancedOptions && (
              <div className="mt-4 space-y-4">
                {/* Categories */}
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      onUpdateNode(selectedNode.id, { category: e.target.value });
                    }}
                    className={`mt-1 block w-full p-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-200' 
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <option value="">Select a category</option>
                    <option value="research">Research</option>
                    <option value="ideas">Ideas</option>
                    <option value="tasks">Tasks</option>
                    <option value="notes">Notes</option>
                    <option value="questions">Questions</option>
                  </select>
                </div>

                {/* Custom Styles */}
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <select
                    value={selectedNode.data.fontSize || 'normal'}
                    onChange={(e) => {
                      onUpdateNode(selectedNode.id, { fontSize: e.target.value });
                    }}
                    className={`mt-1 block w-full p-2 rounded-md ${
                      darkMode 
                        ? 'bg-gray-800 text-gray-200' 
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    <option value="small">Small</option>
                    <option value="normal">Normal</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                {/* Created/Modified Dates */}
                <div className="text-sm space-y-1 opacity-70">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    Created: {new Date(selectedNode.data.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} />
                    Modified: {new Date(selectedNode.data.updatedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="flex-1 flex flex-col items-center justify-center p-4 opacity-60">
        <Activity className="h-12 w-12 mb-4" />
        <p className="text-center text-sm">
          Select a node to view and edit its details
        </p>
      </div>
    )}
  </div>
);
};

AnalysisPanel.propTypes = {
selectedNode: PropTypes.shape({
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    fullText: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string),
    connections: PropTypes.number,
    style: PropTypes.object,
    fontSize: PropTypes.string,
    category: PropTypes.string,
    priority: PropTypes.string,
    createdAt: PropTypes.number,
    updatedAt: PropTypes.number,
    notes: PropTypes.string
  }).isRequired,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
}),
networkStats: PropTypes.shape({
  nodeCount: PropTypes.number.isRequired,
  edgeCount: PropTypes.number.isRequired
}).isRequired,
darkMode: PropTypes.bool,
nodes: PropTypes.array.isRequired,
edges: PropTypes.array.isRequired,
onUpdateNode: PropTypes.func.isRequired,
onDeleteNode: PropTypes.func.isRequired,
reactFlowInstance: PropTypes.object
};

export default AnalysisPanel;