import PropTypes from 'prop-types';
import { useState } from 'react';
import { Send, Hash } from 'lucide-react';

const TextInput = ({ onSubmit, darkMode }) => {
  const [text, setText] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      const customTags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      onSubmit(text, customTags);
      setText('');
      setTags('');
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your thoughts..."
          className={`
            flex-1 p-3 rounded-lg shadow-lg
            border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            ${darkMode 
              ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
              : 'bg-white text-gray-900 placeholder-gray-400'
            }
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          `}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!text.trim()}
          className={`
            px-4 py-2 rounded-lg shadow-lg
            flex items-center gap-2 transition-colors duration-200
            ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}
            ${!text.trim() ? 'opacity-50 cursor-not-allowed' : ''}
            text-white font-medium
          `}
        >
          <Send className="h-4 w-4" />
          Add Node
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Hash className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Add tags (comma-separated)..."
          className={`
            flex-1 p-2 rounded-lg text-sm
            border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
            ${darkMode 
              ? 'bg-gray-800 text-gray-100 placeholder-gray-500' 
              : 'bg-white text-gray-900 placeholder-gray-400'
            }
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
          `}
        />
      </div>
    </div>
  );
};

TextInput.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  darkMode: PropTypes.bool
};

export default TextInput;