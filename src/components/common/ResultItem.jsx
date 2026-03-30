import { highlightText } from '../../utils/search';
import { useEffect, useRef } from 'react';

const ResultItem = ({
  preset,
  onSelect,
  isSelected = false,
  searchQuery = '',
  compact = false
}) => {
  const itemRef = useRef(null);

  const handleClick = () => {
    if (onSelect) {
      onSelect(preset);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isSelected]);

  // Helper function to render highlighted text
  const renderHighlightedText = (text, query) => {
    if (!query || !text) return text;
    
    const parts = highlightText(text, query);
    
    return parts.map((part, index) => {
      const isMatch = query && part.toLowerCase().includes(query.toLowerCase());
      return (
        <span
          key={index}
          className={isMatch ? 'bg-yellow-100 text-gray-900 px-0.5 rounded' : ''}
        >
          {part}
        </span>
      );
    });
  };

  const primaryTag = preset.tags ? Object.entries(preset.tags)[0] : null;

  return (
    <button
      ref={itemRef}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`
        w-full text-left cursor-pointer px-4 py-3 border-l-2
        transition-all duration-150
        focus:outline-none
        ${isSelected
          ? 'bg-blue-50 border-blue-600'
          : 'border-transparent hover:bg-gray-50'
        }
      `}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
    >
      <div className="text-sm font-semibold text-gray-900 mb-0.5">
        {renderHighlightedText(preset.name, searchQuery)}
      </div>
      {primaryTag && (
        <div className="text-xs font-mono text-gray-500">
          {renderHighlightedText(primaryTag[0], searchQuery)}
          =
          {renderHighlightedText(primaryTag[1], searchQuery)}
        </div>
      )}
    </button>
  );
};

export default ResultItem;
