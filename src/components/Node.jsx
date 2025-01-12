import PropTypes from 'prop-types';
import { Handle, Position } from 'reactflow';
import { memo } from 'react';
import { useTheme } from '../context/ThemeContext';

const CustomNode = ({ data, selected }) => {
  const { darkMode } = useTheme();

  return (
    <div 
      className={`
        px-4 py-3 shadow-lg rounded-lg transition-all duration-200 
        min-w-[200px] max-w-[300px] transform
        ${selected ? 'scale-105' : 'scale-100'}
        ${darkMode 
          ? 'bg-gray-800 border-2 border-gray-700 hover:border-blue-500' 
          : 'bg-white border-2 border-gray-200 hover:border-blue-600'
        }
        ${selected 
          ? darkMode 
            ? 'ring-2 ring-blue-500 border-blue-500' 
            : 'ring-2 ring-blue-600 border-blue-600'
          : ''
        }
      `}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={`w-3 h-3 !border-2 ${
          darkMode 
            ? '!bg-gray-800 !border-blue-400' 
            : '!bg-white !border-blue-600'
        }`}
      />
      
      <div className="flex flex-col">
        {/* Title */}
        <div className={`text-sm font-medium truncate mb-2 ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {data.label}
        </div>

        {/* Tags Section */}
        {data.keywords && data.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {data.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 text-xs rounded-full ${
                  darkMode 
                    ? 'bg-blue-900/50 text-blue-200' 
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}

        {/* Connection Count */}
        {data.connections > 0 && (
          <div className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {data.connections} connection{data.connections !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`w-3 h-3 !border-2 ${
          darkMode 
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
    keywords: PropTypes.arrayOf(PropTypes.string),
    connections: PropTypes.number
  }).isRequired,
  selected: PropTypes.bool
};

export default memo(CustomNode);