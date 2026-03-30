const RelationshipsView = ({ presets }) => {
  const categories = presets.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {});

  const findRelatedPresets = (preset) => {
    return presets.filter(
      (p) =>
        p.id !== preset.id &&
        p.fields.some((field) => preset.fields.includes(field))
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">
          Preset Relationships
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Explore how presets are related by category and shared fields
        </p>
      </div>

      <div className="p-4 space-y-6">
        <section>
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-3">
            Presets by Category
          </h3>
          <div className="space-y-3">
            {Object.entries(categories).map(([category, categoryPresets]) => (
              <div
                key={category}
                className="bg-gray-50 border border-gray-200 rounded p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">{category}</h4>
                  <span className="text-xs text-gray-500">
                    {categoryPresets.length} preset{categoryPresets.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryPresets.slice(0, 8).map((preset) => (
                    <span
                      key={preset.id}
                      className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                    >
                      {preset.name}
                    </span>
                  ))}
                  {categoryPresets.length > 8 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{categoryPresets.length - 8} more
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-3">
            Shared Field Connections
          </h3>
          <div className="space-y-3">
            {presets.slice(0, 6).map((preset) => {
              const related = findRelatedPresets(preset);
              if (related.length === 0) return null;

              return (
                <div
                  key={preset.id}
                  className="bg-gray-50 border border-gray-200 rounded p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{preset.name}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">
                    Shares fields with {related.length} other preset{related.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1.5">
                    {related.slice(0, 3).map((relatedPreset) => {
                      const sharedFields = preset.fields.filter((field) =>
                        relatedPreset.fields.includes(field)
                      );
                      return (
                        <div
                          key={relatedPreset.id}
                          className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                        >
                          <span className="text-xs text-gray-900">
                            {relatedPreset.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {sharedFields.length} field{sharedFields.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      );
                    })}
                    {related.length > 3 && (
                      <p className="text-xs text-gray-500 pl-2">
                        +{related.length - 3} more connections
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RelationshipsView;
