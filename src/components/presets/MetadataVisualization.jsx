const MetadataVisualization = ({ preset, schemaContext }) => {
  if (!preset) return null;

  const getPresetStats = () => {
    const stats = {
      totalFields: (preset.fields?.length || 0) + (preset.moreFields?.length || 0),
      primaryFields: preset.fields?.length || 0,
      optionalFields: preset.moreFields?.length || 0,
      tagCount: Object.keys(preset.tags || {}).length,
      searchTermsCount: preset.searchTerms?.length || 0,
      geometryTypes: preset.geometry?.length || 0,
    };

    if (schemaContext && preset.reference) {
      const parent = schemaContext.getPresetById(preset.reference);
      if (parent) {
        const inheritedFields = parent.fields || [];
        stats.inheritedFields = preset.fields?.filter(f => inheritedFields.includes(f)).length || 0;
        stats.directFields = stats.primaryFields - stats.inheritedFields;
      }
    }

    return stats;
  };

  const stats = getPresetStats();

  const childrenCount = schemaContext
    ? Object.values(schemaContext.presets).filter(p => p.reference === preset.id).length
    : 0;

  const geometryDescriptions = {
    point: 'Single location point (e.g., a tree, a bench)',
    vertex: 'Vertex along a line (e.g., turn in a road)',
    line: 'Linear feature (e.g., road, river, fence)',
    area: 'Enclosed polygon (e.g., building, park, lake)',
  };

  const getFieldTypeBreakdown = (fields, fieldIds) => {
    const breakdown = {};
    fieldIds?.forEach(fieldId => {
      const field = fields[fieldId];
      if (field) {
        breakdown[field.type] = (breakdown[field.type] || 0) + 1;
      }
    });
    return breakdown;
  };

  const allFieldIds = [...(preset.fields || []), ...(preset.moreFields || [])];
  
  return (
    <section className="bg-white rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">
          Preset Metadata
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Detailed technical information and statistics
        </p>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-900">{stats.totalFields}</div>
            <div className="text-xs text-gray-600 font-medium mt-1">Total Fields</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-900">{stats.tagCount}</div>
            <div className="text-xs text-gray-600 font-medium mt-1">OSM Tags</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-900">{stats.geometryTypes}</div>
            <div className="text-xs text-gray-600 font-medium mt-1">Geometries</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-semibold text-gray-900">{childrenCount}</div>
            <div className="text-xs text-gray-600 font-medium mt-1">Child Presets</div>
          </div>
        </div>

        {preset.geometry && preset.geometry.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Supported Geometries
            </h4>
            <div className="space-y-2">
              {preset.geometry.map((geomType) => (
                <div
                  key={geomType}
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-300 text-lg">
                    {geomType === 'point' && '●'}
                    {geomType === 'line' && '―'}
                    {geomType === 'area' && '▢'}
                    {geomType === 'vertex' && '◆'}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm capitalize">{geomType}</div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {geometryDescriptions[geomType] || 'Geometry type'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Field Composition
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xl font-semibold text-gray-900">{stats.primaryFields}</div>
              <div className="text-xs text-gray-600 font-medium">Primary Fields</div>
              {stats.directFields !== undefined && (
                <div className="text-xs text-gray-500 mt-1">
                  {stats.directFields} direct, {stats.inheritedFields} inherited
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xl font-semibold text-gray-900">{stats.optionalFields}</div>
              <div className="text-xs text-gray-600 font-medium">Optional Fields</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Searchability
          </h4>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Search Status</span>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                preset.searchable !== false 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {preset.searchable !== false ? 'Searchable' : 'Hidden'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Search Terms</span>
              <span className="text-sm font-semibold text-gray-900">{stats.searchTermsCount}</span>
            </div>
          </div>
        </div>

        {preset.reference && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-800">
              Inheritance Chain
            </h4>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    Inherits from: <span className="font-mono text-blue-600">{preset.reference}</span>
                  </div>
                  {schemaContext && (
                    <div className="text-xs text-gray-600 mt-1">
                      {(() => {
                        const parent = schemaContext.getPresetById(preset.reference);
                        return parent ? parent.name : preset.reference;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Technical Details
          </h4>
          <div className="bg-gray-900 rounded-lg p-4 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="text-blue-400">{preset.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Category:</span>
              <span className="text-blue-400">{preset.category}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Icon:</span>
              <span className="text-blue-400">{preset.icon || 'default'}</span>
            </div>
            {preset.matchScore !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Match Score:</span>
                <span className="text-blue-400">{preset.matchScore}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetadataVisualization;
