/**
 * Inheritance Utilities
 * Helper functions to analyze preset inheritance
 */

/**
 * Get inheritance information for a preset
 * Returns: { parent, ownFields, inheritedFields, allFields }
 */
export const getInheritanceInfo = (preset, allPresets, allFields) => {
  if (!preset || !allPresets) {
    return {
      parent: null,
      ownFields: [],
      inheritedFields: [],
      allFields: []
    };
  }

  // Get parent preset
  const parent = preset.reference 
    ? allPresets.find(p => p.id === preset.reference)
    : null;

  // Get own fields (defined in this preset only)
  const ownFieldIds = preset.fields || [];

  // Get all inherited fields recursively
  const inheritedFieldIds = parent ? getAllInheritedFields(parent, allPresets) : [];

  // Remove duplicates from inherited fields that are also in own fields
  const uniqueInheritedFieldIds = inheritedFieldIds.filter(
    fieldId => !ownFieldIds.includes(fieldId)
  );

  // Map field IDs to field details
  const mapFieldsToDetails = (fieldIds) => {
    return fieldIds.map(fieldId => {
      const field = allFields?.find(f => f.id === fieldId);
      return field || { id: fieldId, label: fieldId, type: 'unknown' };
    });
  };

  const ownFields = mapFieldsToDetails(ownFieldIds);
  const inheritedFields = mapFieldsToDetails(uniqueInheritedFieldIds);
  const combinedFields = [...ownFields, ...inheritedFields];

  return {
    parent,
    ownFields,
    inheritedFields,
    allFields: combinedFields
  };
};

/**
 * Recursively get all inherited fields from parent chain
 */
const getAllInheritedFields = (preset, allPresets, visited = new Set()) => {
  // Prevent circular inheritance
  if (visited.has(preset.id)) {
    return [];
  }
  
  visited.add(preset.id);
  
  let fields = [...(preset.fields || [])];
  
  // If preset has a parent, get its fields too
  if (preset.reference) {
    const parent = allPresets.find(p => p.id === preset.reference);
    if (parent) {
      const parentFields = getAllInheritedFields(parent, allPresets, visited);
      fields = [...parentFields, ...fields];
    }
  }
  
  // Remove duplicates while preserving order
  return [...new Set(fields)];
};

/**
 * Get the full parent chain for a preset
 */
export const getParentChain = (preset, allPresets) => {
  const chain = [];
  let current = preset;
  const visited = new Set();
  
  while (current && current.reference && !visited.has(current.id)) {
    visited.add(current.id);
    const parent = allPresets.find(p => p.id === current.reference);
    if (parent) {
      chain.push(parent);
      current = parent;
    } else {
      break;
    }
  }
  
  return chain;
};
