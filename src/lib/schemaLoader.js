/**
 * Schema Loader Module
 * Handles loading and validation of OSM iD tagging schema JSON data
 */

class SchemaLoaderError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'SchemaLoaderError';
    this.cause = cause;
  }
}

/**
 * Validates the basic structure of schema data
 */
const validateSchema = (data) => {
  if (!data || typeof data !== 'object') {
    throw new SchemaLoaderError('Schema must be an object');
  }

  const requiredSections = ['presets', 'fields'];
  const missingSections = requiredSections.filter(section => !(section in data));
  
  if (missingSections.length > 0) {
    throw new SchemaLoaderError(
      `Missing required sections: ${missingSections.join(', ')}`
    );
  }

  return true;
};

/**
 * Load schema from a URL
 */
export const loadSchemaFromURL = async (url) => {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new SchemaLoaderError(
        `Failed to fetch schema: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    validateSchema(data);
    
    return data;
  } catch (error) {
    if (error instanceof SchemaLoaderError) {
      throw error;
    }
    throw new SchemaLoaderError('Failed to load schema from URL', error);
  }
};

/**
 * Load schema from a local file (for testing/development)
 */
export const loadSchemaFromFile = async (filePath) => {
  try {
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new SchemaLoaderError(
        `Failed to load local schema file: ${response.status}`
      );
    }

    const data = await response.json();
    validateSchema(data);
    
    return data;
  } catch (error) {
    if (error instanceof SchemaLoaderError) {
      throw error;
    }
    throw new SchemaLoaderError('Failed to load schema from file', error);
  }
};

/**
 * Load schema with automatic retry logic
 */
export const loadSchemaWithRetry = async (source, options = {}) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    isURL = true,
  } = options;

  let lastError;
  const loadFn = isURL ? loadSchemaFromURL : loadSchemaFromFile;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await loadFn(source);
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
      }
    }
  }

  throw new SchemaLoaderError(
    `Failed to load schema after ${maxRetries} attempts`,
    lastError
  );
};

/**
 * Simple in-memory cache for loaded schemas
 */
class SchemaCache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
  }

  set(key, data, ttl = 3600000) { // 1 hour default TTL
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    if (!this.cache.has(key)) {
      return null;
    }

    const timestamp = this.timestamps.get(key);
    if (timestamp && Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }

    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  has(key) {
    return this.get(key) !== null;
  }
}

export const schemaCache = new SchemaCache();

/**
 * Load schema with caching
 */
export const loadSchema = async (source, options = {}) => {
  const {
    useCache = true,
    cacheTTL = 3600000,
    ...loadOptions
  } = options;

  if (useCache && schemaCache.has(source)) {
    return schemaCache.get(source);
  }

  const schema = await loadSchemaWithRetry(source, loadOptions);

  if (useCache) {
    schemaCache.set(source, schema, cacheTTL);
  }

  return schema;
};

export { SchemaLoaderError };
