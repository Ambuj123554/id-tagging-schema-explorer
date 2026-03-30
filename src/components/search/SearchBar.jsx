import { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { getSearchSuggestions } from '../../utils/search';
import SearchSuggestions from './SearchSuggestions';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search presets by name, tags, or terms...',
  allPresets = [],
  onSelectSuggestion
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const debouncedQuery = useDebounce(inputValue, 300);

  useEffect(() => {
    onChange(debouncedQuery);
  }, [debouncedQuery, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      setIsSearching(true);

      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 50);

      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [debouncedQuery, allPresets]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  const handleSelectSuggestion = (preset) => {
    if (onSelectSuggestion) {
      onSelectSuggestion(preset);
    }
  };

  const handleCloseSuggestions = () => {
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasValue = inputValue.length > 0;

  return (
    <div className="bg-white z-10 p-3 border-b border-gray-200 flex-shrink-0">
      <div className="relative" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
          <svg
            className={`h-4 w-4 transition-colors ${
              isSearching ? 'text-blue-500' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue.trim() && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="block w-full pl-8 pr-8 py-1.5 text-sm border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-150"
          placeholder={placeholder}
          aria-label="Search presets"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          autoComplete="off"
        />

        {hasValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors z-10 cursor-pointer"
            aria-label="Clear search"
            type="button"
            title="Clear search"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
