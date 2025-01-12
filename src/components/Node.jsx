import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import { memo, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Clock, Tag, AlertCircle } from 'lucide-react';

const getPriorityColor = (priority, darkMode) => {
  switch (priority) {
    case 'high':
      return darkMode ? 'bg-red-600' : 'bg-red-500';
    case 'medium':
      return darkMode ? 'bg-yellow-600' : 'bg-yellow-500';
    case 'low':
      return darkMode ? 'bg-green-600' : 'bg-green-500';
    default:
      return '';
  }
};

const CustomNode = ({ data, selected }) => {
  const { darkMode } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Get dynamic styles based on node properties
  const nodeColor = data.style?.backgroundColor || (darkMode ? 'bg-gray-800' : 'bg-white');
  const textColor = data.style?.color || (darkMode ? 'text-gray-100' : 'text-gray-900');
  const fontSize = data.fontSize ? `text-${data.fontSize}` : 'text-sm';
  const priorityColor = getPriorityColor(data.priority, darkMode);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group
        px-4 py-3 shadow-lg rounded-lg 
        transition-all duration-300 ease-in-out
        ${nodeColor}
        ${selected || isHovered ? 'scale-105 z-50' : 'scale-100'}
        min-w-[250px] max-w-[400px]
        border-2 ${
          selected 
            ? 'ring-2 ring-blue-500 border-blue-500' 
            : darkMode 
              ? 'border-gray-700 hover:border-blue-500' 
              : 'border-gray-200 hover:border-blue-600'
        }
        ${data.category ? `${darkMode ? 'ring-1' : 'ring-1'} ring-opacity-50 ring-${data.category}-500` : ''}
      `}
    >
      {/* Priority Indicator */}
      {data.priority && (
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${priorityColor} ring-2 ring-white dark:ring-gray-800`} />
      )}

      <Handle 
        type="target" 
        position={Position.Top} 
        className={`w-3 h-3 !border-2 transition-colors ${
          selected || isHovered
            ? '!bg-blue-500 !border-blue-300'
            : darkMode 
              ? '!bg-gray-800 !border-blue-400' 
              : '!bg-white !border-blue-600'
        }`}
      />
      
      <div className="flex flex-col">
        {/* Title */}
        <div className={`font-medium mb-2 ${fontSize} ${textColor}`}>
          {isHovered ? data.fullText : data.label}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
          {data.category && (
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {data.category}
            </span>
          )}
          {data.updatedAt && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {new Date(data.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Keywords */}
        {data.keywords && data.keywords.length > 0 && (
          <div className={`
            flex flex-wrap gap-1 mb-2
            ${isHovered ? 'max-h-none' : 'max-h-6 overflow-hidden'}
            transition-all duration-300
          `}>
            {data.keywords.map((keyword, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 text-xs rounded-full transition-colors ${
                  darkMode 
                    ? 'bg-blue-900/50 text-blue-200 hover:bg-blue-800/50' 
                    : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Notes Preview */}
        {data.notes && isHovered && (
          <div className="mt-2 text-xs opacity-70 line-clamp-2">
            {data.notes}
          </div>
        )}

        {/* Connection Count */}
        <div className={`
          flex items-center gap-2 text-xs mt-2
          ${darkMode ? 'text-gray-400' : 'text-gray-500'}
        `}>
          {data.connections > 0 && (
            <span className="flex items-center gap-1">
              <AlertCircle size={12} />
              {data.connections} connection{data.connections !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`w-3 h-3 !border-2 transition-colors ${
          selected || isHovered
            ? '!bg-blue-500 !border-blue-300'
            : darkMode 
              ? '!bg-gray-800 !border-blue-400' 
              : '!bg-white !border-blue-600'
        }`}
      />
    </div>
  );
};

CustomNode.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    fullText: PropTypes.string,
    keywords: PropTypes.arrayOf(PropTypes.string),
    connections: PropTypes.number,
    category: PropTypes.string,
    priority: PropTypes.string,
    notes: PropTypes.string,
    updatedAt: PropTypes.number,
    style: PropTypes.shape({
      backgroundColor: PropTypes.string,
      color: PropTypes.string
    }),
    fontSize: PropTypes.string
  }).isRequired,
  selected: PropTypes.bool
};

export default memo(CustomNode);