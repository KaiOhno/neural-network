import PropTypes from 'prop-types';
import { useState } from 'react';
import { Send } from 'lucide-react';

const TextInput = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your thoughts..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition-colors duration-200 flex items-center gap-2"
          disabled={!text.trim()}
        >
          <Send className="h-4 w-4" />
          Add Node
        </button>
      </div>
    </form>
  );
};

TextInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default TextInput;