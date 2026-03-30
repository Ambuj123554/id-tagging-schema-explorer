/**
 * FieldSourceVisualization Component
 * Shows where each field comes from in the inheritance chain
 */
const FieldSourceVisualization = ({ preset, fields, schemaContext }) => {
  if (!schemaContext || !preset) return null;

  // Get complete ancestry chain
  const getAncestryChain = (presetId) => {
    const chain = [];
    let current = schemaContext.getPresetById(presetId);
    
    while (current) {
      chain.unshift(current);
      if (current.reference) {
        current = schemaContext.getPresetById(current.reference);
      } else {
        break;
      }
    }
    
    return chain;
  };

  // Build field source map
  const buildFieldSourceMap = () => {
    const ancestryChain = getAncestryChain(preset.id);
    const fieldSources = new Map();

    // Work backwards from root to current
    ancestryChain.forEach((ancestor) => {
      // Track where each field was first introduced
      (ancestor.fields || []).forEach(fieldId => {
        if (!fieldSources.has(fieldId)) {
          fieldSources.set(fieldId, {
            fieldId,
            source: ancestor,
            level: ancestryChain.indexOf(ancestor),
            type: 'field'
          });
        }
      });

      (ancestor.moreFields || []).forEach(fieldId => {
        if (!fieldSources.has(fieldId)) {
          fieldSources.set(fieldId, {
            fieldId,
            source: ancestor,
            level: ancestryChain.indexOf(ancestor),
            type: 'moreField'
          });
        }
      });
    });

    return { fieldSources, ancestryChain };
  };

  const { fieldSources, ancestryChain } = buildFieldSourceMap();
  const currentIndex = ancestryChain.findIndex(a => a.id === preset.id);

  // Group fields by source
  const fieldsBySource = new Map();
  fieldSources.forEach((info, fieldId) => {
    const sourceId = info.source.id;
    if (!fieldsBySource.has(sourceId)) {
      fieldsBySource.set(sourceId, {
        preset: info.source,
        level: info.level,
        fields: [],
        moreFields: []
      });
    }
    
    const fieldData = fields[fieldId];
    if (fieldData) {
      if (info.type === 'field') {
        fieldsBySource.get(sourceId).fields.push({ ...info, fieldData });
      } else {
        fieldsBySource.get(sourceId).moreFields.push({ ...info, fieldData });
      }
    }
  });

  // Sort by level (root first)
  const sortedSources = Array.from(fieldsBySource.entries())
    .sort(([, a], [, b]) => a.level - b.level);

  return (
    <section className="bg-white rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">
          Field Sources
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Where each field is defined in the inheritance chain
        </p>
      </div>

      <div className="p-5 space-y-4">
        {sortedSources.map(([sourceId, sourceData], index) => {
          const isCurrent = sourceData.level === currentIndex;
          const hasFields = sourceData.fields.length > 0 || sourceData.moreFields.length > 0;

          if (!hasFields) return null;

          return (
            <div key={sourceId} className="space-y-3">
              {/* Source Header */}
              <div className={`
                flex items-center gap-3 p-3 rounded-lg border bg-white
                ${isCurrent ? 'border-blue-500 shadow-sm' : 'border-gray-200'}
              `}>
                <span className="text-2xl">{sourceData.preset.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{sourceData.preset.name}</h4>
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded font-medium">
                        Current
                      </span>
                    )}
                    {!isCurrent && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">
                        Level {sourceData.level}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{sourceData.preset.id}</p>
                </div>
                <div className="text-sm font-medium text-gray-700">
                  {sourceData.fields.length + sourceData.moreFields.length} fields
                </div>
              </div>

              {/* Primary Fields */}
              {sourceData.fields.length > 0 && (
                <div className="ml-6 space-y-2">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Primary Fields
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sourceData.fields.map(({ fieldId, fieldData }) => (
                      <div
                        key={fieldId}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{fieldData.label}</div>
                          <div className="text-xs text-gray-500 font-mono">{fieldData.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Optional Fields */}
              {sourceData.moreFields.length > 0 && (
                <div className="ml-6 space-y-2">
                  <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Optional Fields
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {sourceData.moreFields.map(({ fieldId, fieldData }) => (
                      <div
                        key={fieldId}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 text-sm"
                      >
                        <div className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{fieldData.label}</div>
                          <div className="text-xs text-gray-500 font-mono">{fieldData.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="font-semibold">Legend:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Primary</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-gray-400" />
              <span>Optional</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FieldSourceVisualization;
