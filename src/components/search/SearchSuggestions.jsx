import { useState, useEffect, useRef } from 'react';
import ResultItem from '../common/ResultItem';

const SearchSuggestions = ({
  suggestions,
  onSelect,
  searchQuery,
  isLoading = false,
  show = false,
  onClose
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
            setSelectedIndex(-1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (onClose) {
            onClose();
          }
          setSelectedIndex(-1);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [show, suggestions, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  if (!show) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl z-[1000] overflow-hidden"
      style={{ maxHeight: '400px' }}
    >
      {isLoading ? (
        <div className="px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-sm text-gray-600 mt-2">Searching...</p>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div className="text-gray-400 text-3xl mb-2">🔍</div>
          <p className="text-sm text-gray-600">No results found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try different keywords
          </p>
        </div>
      ) : (
        <>
          <div
            ref={suggestionsRef}
            role="listbox"
            className="divide-y divide-gray-100 overflow-y-auto"
            style={{ maxHeight: '400px' }}
          >
            {suggestions.map((preset, index) => (
              <div
                key={preset.id}
                className={`transition-colors ${
                  selectedIndex === index
                    ? 'bg-blue-50 border-l-4 border-blue-500'
                    : 'border-l-4 border-transparent'
                }`}
              >
                <ResultItem
                  preset={preset}
                  onSelect={onSelect}
                  searchQuery={searchQuery}
                  compact={true}
                  isSelected={selectedIndex === index}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSuggestions;
