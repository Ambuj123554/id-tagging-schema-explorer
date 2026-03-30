import ResultItem from '../common/ResultItem';

const PresetList = ({ presets, onSelect, selectedPreset, searchQuery = '' }) => {
  if (presets.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center">
        <div>
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-sm text-gray-600 font-medium mb-1">No presets found</p>
          <p className="text-xs text-gray-500">
            Try adjusting your search or category filter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto"
      style={{ scrollBehavior: 'smooth' }}
    >
      {presets.map((preset) => (
        <ResultItem
          key={preset.id}
          preset={preset}
          onSelect={onSelect}
          isSelected={selectedPreset?.id === preset.id}
          searchQuery={searchQuery}
          compact={false}
        />
      ))}
    </div>
  );
};

export default PresetList;
