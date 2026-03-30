/**
 * Main export for the OSM schema parsing library
 */

// Loader
export {
  loadSchema,
  loadSchemaFromURL,
  loadSchemaFromFile,
  loadSchemaWithRetry,
  schemaCache,
  SchemaLoaderError,
} from './schemaLoader.js';

// Parser
export {
  parseSchema,
  presetsToArray,
  extractSearchTerms,
  resolveIcon,
  resolveInheritedFields,
  resolveInheritedTags,
  extractCategory,
  normalizePreset,
  normalizeFields,
  extractCategories,
} from './schemaParser.js';

// Utils
export {
  SchemaContext,
  createSchemaContext,
  setGlobalContext,
  getPresetById,
  resolveInheritedFieldsForPreset,
  searchPresets,
  getFieldsByPreset,
  getCategorizedPresets,
} from './schemaUtils.js';

/**
 * Convenience function to load and parse schema in one step
 */
export const loadAndParseSchema = async (source, options = {}) => {
  const { loadSchema } = await import('./schemaLoader.js');
  const { parseSchema } = await import('./schemaParser.js');
  const { createSchemaContext } = await import('./schemaUtils.js');
  
  const rawSchema = await loadSchema(source, options);
  const parsedSchema = parseSchema(rawSchema);
  const context = createSchemaContext(parsedSchema);
  
  return {
    raw: rawSchema,
    parsed: parsedSchema,
    context,
  };
};
