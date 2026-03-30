import { useState } from 'react';

/**
 * InheritanceTree Component
 * Visualizes the inheritance hierarchy (parent → current → children)
 */
const InheritanceTree = ({ preset, schemaContext }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set([preset.id]));
  
  if (!preset) return null;

  if (!schemaContext) return null;

  // Build complete ancestry chain (from root to current preset)
  const getAncestryChain = (presetId) => {
    const chain = [];
    let current = schemaContext.getPresetById(presetId);
    
    while (current) {
      chain.unshift(current); // Add to beginning
      if (current.reference) {
        current = schemaContext.getPresetById(current.reference);
      } else {
        break;
      }
    }
    
    return chain;
  };

  // Get all descendants (children, grandchildren, etc.)
  const getDescendants = (presetId, depth = 0) => {
    if (depth > 10) return []; // Prevent infinite recursion
    
    const children = Object.values(schemaContext.presets).filter(
      p => p.reference === presetId
    );
    
    const descendants = [];
    children.forEach(child => {
      descendants.push({ preset: child, depth });
      descendants.push(...getDescendants(child.id, depth + 1));
    });
    
    return descendants;
  };

  const ancestryChain = getAncestryChain(preset.id);
  const descendants = getDescendants(preset.id);
  const currentIndex = ancestryChain.findIndex(p => p.id === preset.id);

  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  };

  const renderPresetNode = (nodePreset, isCurrent, isAncestor, depth = 0) => {
    const hasChildren = descendants.some(d => d.preset.reference === nodePreset.id);
    const isExpanded = expandedNodes.has(nodePreset.id);

    return (
      <div key={nodePreset.id} className="relative" style={{ marginLeft: depth > 0 ? '32px' : '0' }}>
        <div
          className={`
            flex items-center gap-3 p-3 rounded-lg border transition-all bg-white
            ${isCurrent 
              ? 'border-blue-500 shadow-md' 
              : isAncestor 
                ? 'border-gray-300'
                : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          {/* Expand/Collapse button for nodes with children */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(nodePreset.id)}
              className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isExpanded ? '−' : '+'}
            </button>
          )}
          {!hasChildren && <div className="w-6" />}

          {/* Icon */}
          <span className="text-2xl flex-shrink-0">{nodePreset.icon}</span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900 text-sm">
                {nodePreset.name}
              </h4>
              {isCurrent && (
                <span className="text-xs px-2 py-0.5 bg-blue-500 text-white rounded font-medium">
                  Current
                </span>
              )}
              {isAncestor && (
                <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-medium">
                  Parent
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 font-mono mt-0.5">{nodePreset.id}</p>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-medium">{nodePreset.fields?.length || 0}</span> fields
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">{Object.keys(nodePreset.tags || {}).length}</span> tags
            </span>
          </div>
        </div>

        {/* Connection line to next node */}
        {!isCurrent && (
          <div className="flex items-center justify-center h-6">
            <div className="w-px h-full bg-gray-300" />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-lg shadow border border-gray-200">
      <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-900">
          Inheritance Tree
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Complete hierarchy from root to descendants
        </p>
      </div>

      <div className="p-5 space-y-2">
        {/* Ancestry Chain (from root to current) */}
        {ancestryChain.map((ancestor, index) => {
          const isCurrent = index === currentIndex;
          const isAncestor = index < currentIndex;
          return renderPresetNode(ancestor, isCurrent, isAncestor);
        })}

        {/* Descendants (children and beyond) */}
        {descendants.length > 0 && (
          <>
            <div className="flex items-center justify-center h-6">
              <div className="w-px h-full bg-gray-300" />
            </div>
            {descendants
              .filter(d => expandedNodes.has(d.preset.reference))
              .map(({ preset: descendant, depth }) =>
                renderPresetNode(descendant, false, false, depth + 1)
              )}
          </>
        )}

        {/* Info message if no descendants */}
        {descendants.length === 0 && (
          <>
            <div className="flex items-center justify-center h-6">
              <div className="w-px h-full bg-gray-300" />
            </div>
            <div className="text-center py-3 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
              No child presets inherit from this one
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default InheritanceTree;
