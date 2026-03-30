import InheritanceSection from './InheritanceSection';
import { getInheritanceInfo } from '../../utils/inheritanceUtils';

const PresetDetail = ({ preset, fields, schemaContext, searchQuery = '', onSelectPreset }) => {
  // Helper function to render highlighted text
  const renderHighlightedText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = String(text).split(regex).filter(Boolean);
    
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

  if (!preset) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center bg-gray-50">
        <div>
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm text-gray-500">Select a preset to view details</p>
        </div>
      </div>
    );
  }

  // Get inheritance information
  const allPresets = schemaContext?.presets ? Object.values(schemaContext.presets) : [];
  const inheritanceInfo = getInheritanceInfo(preset, allPresets, fields);

  // Find children presets (where child.reference === current preset.id)
  const childrenPresets = allPresets.filter(p => p.reference === preset.id);
  const displayedChildren = childrenPresets.slice(0, 5);
  const moreChildrenCount = childrenPresets.length - displayedChildren.length;

  const presetFields = preset.fields || [];
  const fieldDetails = presetFields.map(fieldId => {
    const field = fields?.find(f => f.id === fieldId);
    return field || { id: fieldId, label: fieldId, type: 'unknown' };
  });

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-3xl">{preset.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {renderHighlightedText(preset.name, searchQuery)}
              </h2>
              {preset.description && (
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{preset.description}</p>
              )}
              {preset.category && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  {preset.category}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Inheritance Section */}
        <InheritanceSection
          parent={inheritanceInfo.parent}
          ownFields={inheritanceInfo.ownFields}
          inheritedFields={inheritanceInfo.inheritedFields}
        />

        {/* Children Presets Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Child Presets</h3>
              <span className="ml-auto text-xs text-gray-500 font-medium">
                {childrenPresets.length}
              </span>
            </div>
          </div>
          <div className="p-5">
            {childrenPresets.length > 0 ? (
              <div className="space-y-2">
                {displayedChildren.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => onSelectPreset && onSelectPreset(child)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm">
                      <span className="text-xl">{child.icon || '📄'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {child.name}
                      </div>
                      {child.tags && Object.entries(child.tags).length > 0 && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {Object.entries(child.tags).slice(0, 1).map(([key, value]) => (
                            <code key={key} className="text-xs text-gray-600 font-mono">
                              {key}={value}
                            </code>
                          ))}
                          {Object.entries(child.tags).length > 1 && (
                            <span className="text-xs text-gray-400">
                              +{Object.entries(child.tags).length - 1}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
                {moreChildrenCount > 0 && (
                  <div className="text-xs text-gray-500 text-center pt-2 font-medium">
                    +{moreChildrenCount} more child preset{moreChildrenCount > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No child presets</p>
            )}
          </div>
        </div>

        {/* Tags Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
              <span className="ml-auto text-xs text-gray-500 font-medium">
                {preset.tags ? Object.keys(preset.tags).length : 0}
              </span>
            </div>
          </div>
          <div className="p-5">
            {preset.tags && Object.entries(preset.tags).length > 0 ? (
              <div className="space-y-2.5">
                {Object.entries(preset.tags).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <code className="px-2.5 py-1.5 bg-white text-gray-800 rounded-md font-mono text-xs font-semibold border border-gray-200 shadow-sm">
                      {renderHighlightedText(key, searchQuery)}
                    </code>
                    <span className="text-gray-400 font-medium">=</span>
                    <code className="px-2.5 py-1.5 bg-white text-blue-600 rounded-md font-mono text-xs font-semibold border border-blue-100 shadow-sm">
                      {renderHighlightedText(value, searchQuery)}
                    </code>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No tags defined</p>
            )}
          </div>
        </div>

        {/* Geometry Types Card */}
        {preset.geometry && preset.geometry.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">Geometry Types</h3>
              </div>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {preset.geometry.map((geom) => (
                  <span
                    key={geom}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 shadow-sm"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    {geom}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Fields Card */}
        {presetFields.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-sm font-semibold text-gray-900">Fields</h3>
                <span className="ml-auto text-xs text-gray-500 font-medium">{presetFields.length}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {fieldDetails.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-900">
                        {renderHighlightedText(field.label || field.id, searchQuery)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metadata Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-900">Metadata</h3>
            </div>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">ID</span>
                <code className="text-xs text-gray-900 font-mono bg-white px-2.5 py-1.5 rounded border border-gray-200 shadow-sm">
                  {preset.id}
                </code>
              </div>
              {preset.searchable !== undefined && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600 font-medium">Searchable</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    preset.searchable 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-200 text-gray-700'
                  }`}>
                    {preset.searchable ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresetDetail;
