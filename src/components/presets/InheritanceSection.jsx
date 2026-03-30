import { useState } from 'react';

const InheritanceSection = ({ parent, ownFields, inheritedFields }) => {
  const [showInherited, setShowInherited] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">Inheritance</h3>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {parent ? (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-blue-900 mb-2">Inherits from</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{parent.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-blue-900">{parent.name}</div>
                    <div className="text-xs text-blue-700 font-mono mt-0.5">{parent.id}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">No inheritance</div>
                <div className="text-xs text-gray-500 mt-0.5">This is a base preset</div>
              </div>
            </div>
          </div>
        )}

        {ownFields.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700">Own Fields</span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                {ownFields.length}
              </span>
            </div>
            <div className="space-y-2">
              {ownFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border-l-2 border-green-500 shadow-sm hover:shadow transition-shadow"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-md font-semibold">
                      Own
                    </span>
                    <span className="text-sm font-medium text-gray-900">{field.label || field.id}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                    {field.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {inheritedFields.length > 0 && (
          <div>
            <button
              onClick={() => setShowInherited(!showInherited)}
              className="flex items-center gap-2 mb-3 w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors group"
            >
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showInherited ? 'rotate-90' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <div className="flex items-center gap-2 flex-1">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700">Inherited Fields</span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-medium">
                {inheritedFields.length}
              </span>
            </button>

            {showInherited && (
              <div className="space-y-2 ml-6">
                {inheritedFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border-l-2 border-orange-400 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-md font-semibold">
                        Inherited
                      </span>
                      <span className="text-sm font-medium text-gray-900">{field.label || field.id}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">Total Fields</span>
              <span className="font-bold text-gray-900 text-sm">
                {ownFields.length + inheritedFields.length}
              </span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Own</span>
              </div>
              <span className="font-semibold text-green-700">{ownFields.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                <span className="text-gray-600">Inherited</span>
              </div>
              <span className="font-semibold text-orange-700">{inheritedFields.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InheritanceSection;
