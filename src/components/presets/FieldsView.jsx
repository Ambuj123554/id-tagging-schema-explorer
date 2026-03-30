const FieldsView = ({ fields }) => {
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.type || 'unknown';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {});

  const sortedTypes = Object.keys(groupedFields).sort();

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-900">Fields</h2>
        <p className="text-sm text-gray-600 mt-1">
          {fields.length} fields grouped by type
        </p>
      </div>

      <div className="p-4 space-y-6">
        {sortedTypes.map((type) => (
          <section key={type}>
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wide mb-3">
              {type} ({groupedFields[type].length})
            </h3>
            <div className="space-y-2">
              {groupedFields[type].map((field) => (
                <div
                  key={field.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {field.label || field.id}
                    </span>
                    <code className="text-xs text-gray-500 font-mono">{field.id}</code>
                  </div>
                  {field.placeholder && (
                    <p className="text-xs text-gray-600 mt-1">
                      Placeholder: {field.placeholder}
                    </p>
                  )}
                  {field.options && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {field.options.slice(0, 5).map((option, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded text-xs"
                        >
                          {option}
                        </span>
                      ))}
                      {field.options.length > 5 && (
                        <span className="text-xs text-gray-500">
                          +{field.options.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FieldsView;
