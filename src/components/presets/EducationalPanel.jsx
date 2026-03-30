import { useState } from 'react';

const EducationalPanel = ({ preset, schemaContext }) => {
  const [expandedSections, setExpandedSections] = useState(new Set(['overview']));

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const sections = [
    {
      id: 'overview',
      title: 'What is this preset?',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong>{preset.name}</strong> is a preset template used in OpenStreetMap editors (like iD) 
            to help mappers add consistent, properly-tagged features to the map.
          </p>
          {preset.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {preset.description}
            </p>
          )}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <p className="text-xs text-blue-900">
              <strong>Quick Tip:</strong> Presets ensure that features are tagged consistently 
              across OpenStreetMap, making the data more useful for everyone.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'tags',
      title: 'Understanding OSM Tags',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Tags are key-value pairs that describe features in OpenStreetMap. 
            This preset automatically applies these tags:
          </p>
          <div className="bg-gray-900 rounded-lg p-3 space-y-1.5">
            {Object.entries(preset.tags || {}).map(([key, value]) => (
              <div key={key} className="font-mono text-sm">
                <span className="text-cyan-400">{key}</span>
                <span className="text-gray-500">=</span>
                <span className="text-green-400">"{value}"</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Tags with <code className="bg-gray-200 px-1 rounded">*</code> as the value are wildcards</p>
            <p>• Each tag represents a specific attribute of the feature</p>
            <p>• More tags can be added through the field interface</p>
          </div>
        </div>
      ),
    },
    {
      id: 'inheritance',
      title: 'How Inheritance Works',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <div className="space-y-3">
          {preset.reference ? (
            <>
              <p className="text-sm text-gray-700 leading-relaxed">
                This preset <strong>inherits</strong> from a parent preset, which means it automatically 
                includes all fields and tags from its parent, plus its own additional ones.
              </p>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm font-medium text-gray-900">Parent Preset</div>
                </div>
                <p className="text-sm text-gray-700 font-mono">{preset.reference}</p>
                {schemaContext && (
                  <p className="text-xs text-gray-600 mt-1">
                    {(() => {
                      const parent = schemaContext.getPresetById(preset.reference);
                      return parent ? parent.name : '';
                    })()}
                  </p>
                )}
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p>✓ Inherits all parent fields and tags</p>
                <p>✓ Can add additional fields and tags</p>
                <p>✓ Can override parent values if needed</p>
              </div>
            </>
          ) : (
            <div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                This is a <strong>root preset</strong> – it doesn't inherit from any other preset. 
                It may serve as a parent for other presets.
              </p>
              {(() => {
                if (!schemaContext) return null;
                const children = Object.values(schemaContext.presets).filter(
                  p => p.reference === preset.id
                );
                if (children.length === 0) return null;
                
                return (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                    <p className="text-xs text-gray-700">
                      <strong>{children.length}</strong> preset{children.length !== 1 ? 's' : ''} inherit from this one.
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'fields',
      title: 'Fields Explained',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            Fields are the input forms that mappers fill out when adding or editing features. 
            Each field corresponds to one or more OSM tags.
          </p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-sm font-medium text-gray-900">Primary Fields</span>
              </div>
              <p className="text-xs text-gray-700">
                These are the main fields typically filled out. They appear first in the editor.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-gray-400" />
                <span className="text-sm font-medium text-gray-900">Optional Fields</span>
              </div>
              <p className="text-xs text-gray-700">
                Additional fields for more detailed information. Can be added as needed.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'geometry',
      title: 'Geometry Types',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      ),
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            This preset can be used with the following geometry types:
          </p>
          <div className="space-y-2">
            {preset.geometry?.map(type => (
              <div key={type} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-300 text-lg flex-shrink-0">
                  {type === 'point' && '●'}
                  {type === 'line' && '―'}
                  {type === 'area' && '▢'}
                  {type === 'vertex' && '◆'}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-900 capitalize">{type}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {type === 'point' && 'A single location on the map (e.g., a tree, bench, or traffic light)'}
                    {type === 'line' && 'A linear feature connecting points (e.g., roads, rivers, or power lines)'}
                    {type === 'area' && 'A closed polygon representing a surface (e.g., buildings, parks, or lakes)'}
                    {type === 'vertex' && 'A point along a line where direction changes (e.g., road corners)'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="bg-white rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">
          Learn About This Preset
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Educational guide to understanding presets, fields, and OSM tagging
        </p>
      </div>

      <div className="divide-y divide-gray-200">
        {sections.map((section) => {
          const isExpanded = expandedSections.has(section.id);
          
          return (
            <div key={section.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="text-blue-600">{section.icon}</div>
                  <span className="font-medium text-gray-900 text-sm">{section.title}</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExpanded && (
                <div className="px-4 pb-4">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EducationalPanel;
