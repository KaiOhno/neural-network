import PropTypes from 'prop-types';
import { Handle, Position } from 'react-flow-renderer';
import { memo } from 'react';

const Node = ({ data }) => {
  return (
    <div className="px-4 py-2 shadow-lg rounded-lg bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900 truncate">
          {data.label}
        </div>
        {data.keywords && (
          <div className="mt-1 flex flex-wrap gap-1">
            {data.keywords.slice(0, 3).map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

Node.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    keywords: PropTypes.arrayOf(PropTypes.string)
  }).isRequired
};

export default memo(Node);