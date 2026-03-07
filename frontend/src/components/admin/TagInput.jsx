import React, { useState } from 'react';
import { X } from 'lucide-react';

const TagInput = ({ tags = [], onChange }) => {
  const [input, setInput] = useState('');

  const addTag = (value) => {
    const trimmed = value.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
      {tags.map((tag, idx) => (
        <span key={idx} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full max-w-[150px] truncate">
          {tag}
          <button onClick={() => removeTag(idx)} className="hover:text-red-500">
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 min-w-[100px] outline-none text-sm"
        placeholder={tags.length ? '' : 'Press Enter or comma to add a tag'}
      />
    </div>
  );
};

export default TagInput;
