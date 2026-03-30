/**
 * Schema Parser Module
 * Parses OSM iD tagging schema and resolves inheritance
 */

/**
 * Extract search terms from preset
 */
const extractSearchTerms = (preset) => {
  const terms = [];
  
  // Add name variants
  if (preset.name) {
    terms.push(preset.name.toLowerCase());
  }
  
  // Add explicit search terms
  if (preset.terms && Array.isArray(preset.terms)) {
    terms.push(...preset.terms.map(t => t.toLowerCase()));
  }
  
  // Add tag values
  if (preset.tags) {
    Object.entries(preset.tags).forEach(([key, value]) => {
      if (value && value !== '*') {
        terms.push(value.toLowerCase());
      }
    });
  }
  
  return [...new Set(terms)]; // Remove duplicates
};

/**
 * Icon mapping from Maki icon names to emojis
 */
const iconMap = {
  'maki-restaurant': '🍽️',
  'maki-cafe': '☕',
  'maki-bar': '🍺',
  'maki-fast-food': '🍔',
  'maki-grocery': '🛒',
  'maki-shop': '🏪',
  'maki-bus': '🚌',
  'maki-fuel': '⛽',
  'maki-hospital': '🏥',
  'maki-pharmacy': '💊',
  'maki-bank': '🏦',
  'maki-library': '📚',
  'maki-school': '🏫',
  'maki-park': '🌳',
  'maki-museum': '🏛️',
  'maki-theatre': '🎭',
  'maki-cinema': '🎬',
  'maki-lodging': '🏨',
  'maki-police': '👮',
  'maki-fire-station': '🚒',
  'maki-post': '📮',
  'maki-place-of-worship': '⛪',
  'maki-parking': '🅿️',
  'maki-toilet': '🚻',
  'maki-drinking-water': '💧',
  'maki-bicycle': '🚲',
  'maki-rail': '🚂',
  'maki-airport': '✈️',
  'maki-heliport': '🚁',
  'maki-college': '🎓',
  'maki-playground': '🎪',
  'maki-sports': '⚽',
  'maki-swimming': '🏊',
  'maki-tennis': '🎾',
  'maki-golf': '⛳',
  'maki-stadium': '🏟️',
  'maki-art-gallery': '🖼️',
  'maki-beach': '🏖️',
  'maki-campsite': '⛺',
  'maki-dog-park': '🐕',
  'maki-garden': '🌺',
  'maki-golf': '⛳',
  'maki-picnic-site': '🧺',
  'maki-zoo': '🦁',
};

/**
 * Resolve preset icon
 */
const resolveIcon = (preset, allPresets) => {
  // If preset has icon, convert it
  if (preset.icon) {
    // Check if it's a maki icon that needs conversion
    if (preset.icon.startsWith('maki-')) {
      return iconMap[preset.icon] || '📍';
    }
    // Return as-is if already an emoji or other format
    return preset.icon;
  }
  
  // Try to inherit from parent
  if (preset.reference && allPresets[preset.reference]) {
    return resolveIcon(allPresets[preset.reference], allPresets);
  }
  
  // Default icon based on geometry
  if (preset.geometry) {
    if (preset.geometry.includes('area')) return '▢';
    if (preset.geometry.includes('line')) return '―';
    if (preset.geometry.includes('point')) return '●';
  }
  
  return '📍'; // Default fallback
};

/**
 * Resolve inherited fields from parent presets
 */
const resolveInheritedFields = (preset, allPresets, visited = new Set()) => {
  // Prevent circular inheritance
  if (visited.has(preset.id)) {
    console.warn(`Circular inheritance detected for preset: ${preset.id}`);
    return { fields: [], moreFields: [] };
  }
  
  visited.add(preset.id);
  
  let fields = [...(preset.fields || [])];
  let moreFields = [...(preset.moreFields || [])];
  
  // If preset references another (inheritance)
  if (preset.reference) {
    const parent = allPresets[preset.reference];
    if (parent) {
      const inherited = resolveInheritedFields(parent, allPresets, visited);
      
      // Merge parent fields (parent fields come first, then child overrides)
      fields = [...inherited.fields, ...fields];
      moreFields = [...inherited.moreFields, ...moreFields];
      
      // Remove duplicates while preserving order
      fields = [...new Set(fields)];
      moreFields = [...new Set(moreFields)];
    }
  }
  
  return { fields, moreFields };
};

/**
 * Resolve inherited tags from parent presets
 */
const resolveInheritedTags = (preset, allPresets, visited = new Set()) => {
  if (visited.has(preset.id)) {
    return {};
  }
  
  visited.add(preset.id);
  
  let tags = { ...(preset.tags || {}) };
  
  if (preset.reference) {
    const parent = allPresets[preset.reference];
    if (parent) {
      const parentTags = resolveInheritedTags(parent, allPresets, visited);
      // Child tags override parent tags
      tags = { ...parentTags, ...tags };
    }
  }
  
  return tags;
};

/**
 * Extract category from preset ID or tags
 */
const extractCategory = (preset) => {
  if (preset.category) {
    return preset.category;
  }
  
  // Try to infer from ID (e.g., "amenity/restaurant" -> "amenity")
  if (preset.id) {
    const parts = preset.id.split('/');
    if (parts.length > 0) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  }
  
  // Try to infer from tags
  if (preset.tags) {
    const mainTag = Object.keys(preset.tags)[0];
    if (mainTag) {
      return mainTag.charAt(0).toUpperCase() + mainTag.slice(1);
    }
  }
  
  return 'Other';
};

/**
 * Normalize a single preset
 */
const normalizePreset = (id, presetData, allPresets) => {
  const inheritedFields = resolveInheritedFields(
    { ...presetData, id },
    allPresets
  );
  
  const inheritedTags = resolveInheritedTags(
    { ...presetData, id },
    allPresets
  );
  
  return {
    id,
    name: presetData.name || id,
    category: extractCategory({ ...presetData, id }),
    tags: inheritedTags,
    icon: resolveIcon({ ...presetData, id }, allPresets),
    fields: inheritedFields.fields,
    moreFields: inheritedFields.moreFields,
    geometry: presetData.geometry || [],
    description: presetData.description || '',
    searchTerms: extractSearchTerms({ ...presetData, id }),
    reference: presetData.reference,
    matchScore: presetData.matchScore,
    searchable: presetData.searchable !== false,
  };
};

/**
 * Normalize fields data
 */
const normalizeFields = (fieldsData) => {
  const normalized = {};
  
  Object.entries(fieldsData).forEach(([id, fieldData]) => {
    normalized[id] = {
      id,
      label: fieldData.label || id,
      type: fieldData.type || 'text',
      placeholder: fieldData.placeholder,
      options: fieldData.options || fieldData.strings?.options,
      universal: fieldData.universal || false,
      prerequisiteTag: fieldData.prerequisiteTag,
      geometry: fieldData.geometry,
      default: fieldData.default,
      key: fieldData.key || id,
      keys: fieldData.keys,
      reference: fieldData.reference,
    };
  });
  
  return normalized;
};

/**
 * Extract categories from presets
 */
const extractCategories = (normalizedPresets) => {
  const categories = new Set(['All']);
  
  Object.values(normalizedPresets).forEach(preset => {
    if (preset.category) {
      categories.add(preset.category);
    }
  });
  
  return Array.from(categories).sort();
};

/**
 * Main parser function
 */
export const parseSchema = (rawSchema) => {
  if (!rawSchema || !rawSchema.presets || !rawSchema.fields) {
    throw new Error('Invalid schema structure');
  }
  
  // First pass: Create basic preset structure for reference resolution
  const allPresets = {};
  Object.entries(rawSchema.presets).forEach(([id, preset]) => {
    allPresets[id] = { ...preset, id };
  });
  
  // Second pass: Normalize all presets with inheritance resolved
  const normalizedPresets = {};
  Object.entries(rawSchema.presets).forEach(([id, preset]) => {
    normalizedPresets[id] = normalizePreset(id, preset, allPresets);
  });
  
  // Normalize fields
  const normalizedFields = normalizeFields(rawSchema.fields);
  
  // Extract categories
  const categories = extractCategories(normalizedPresets);
  
  return {
    presets: normalizedPresets,
    fields: normalizedFields,
    categories,
    metadata: {
      presetCount: Object.keys(normalizedPresets).length,
      fieldCount: Object.keys(normalizedFields).length,
      categoryCount: categories.length,
    },
  };
};

/**
 * Convert normalized presets to array format
 */
export const presetsToArray = (normalizedPresets) => {
  return Object.values(normalizedPresets)
    .filter(preset => preset.searchable !== false)
    .sort((a, b) => a.name.localeCompare(b.name));
};

export {
  extractSearchTerms,
  resolveIcon,
  resolveInheritedFields,
  resolveInheritedTags,
  extractCategory,
  normalizePreset,
  normalizeFields,
  extractCategories,
};
