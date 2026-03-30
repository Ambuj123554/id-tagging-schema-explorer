# OSM iD Tagging Schema Parser Library

A clean, reusable library for loading and parsing OpenStreetMap iD editor tagging schema JSON data.

## Features

- ✅ Load schema from URLs or local files
- ✅ Parse and normalize preset data
- ✅ Resolve inheritance chains between presets
- ✅ Extract tags, fields, icons, and search terms
- ✅ Built-in caching mechanism
- ✅ Rich query utilities
- ✅ TypeScript-friendly structure

## Installation

```javascript
import { loadAndParseSchema, createSchemaContext } from './lib/index.js';
```

## Quick Start

```javascript
// Load and parse schema in one step
const { context } = await loadAndParseSchema('/path/to/schema.json', {
  isURL: false,
  useCache: true
});

// Query presets
const restaurant = context.getPresetById('amenity/restaurant');
const results = context.searchPresets('coffee');
const amenities = context.getPresetsByCategory('Amenity');
```

## API Reference

### Loading Schema

#### `loadSchema(source, options)`
Load schema with automatic caching and retry logic.

```javascript
const schema = await loadSchema('https://example.com/schema.json', {
  useCache: true,
  cacheTTL: 3600000,  // 1 hour
  maxRetries: 3,
  retryDelay: 1000,
  isURL: true
});
```

#### `loadAndParseSchema(source, options)`
Convenience function that loads, parses, and creates a context.

```javascript
const { raw, parsed, context } = await loadAndParseSchema('/data/schema.json');
```

### Parsing Schema

#### `parseSchema(rawSchema)`
Parse raw schema JSON into normalized structure.

```javascript
const parsed = parseSchema(rawSchemaData);
// Returns: { presets, fields, categories, metadata }
```

### Schema Context

Create a context for querying parsed schema data:

```javascript
const context = createSchemaContext(parsed);
```

#### Methods

**`getPresetById(id)`**
```javascript
const preset = context.getPresetById('amenity/restaurant');
```

**`getFieldById(id)`**
```javascript
const field = context.getFieldById('name');
```

**`getFieldsByPreset(presetId)`**
```javascript
const { fields, moreFields } = context.getFieldsByPreset('amenity/cafe');
```

**`searchPresets(query, options)`**
```javascript
const results = context.searchPresets('coffee', {
  category: 'Amenity',
  geometry: 'point',
  tags: { amenity: 'cafe' }
});
```

**`getPresetsByCategory(category)`**
```javascript
const amenities = context.getPresetsByCategory('Amenity');
```

**`getCategorizedPresets()`**
```javascript
const grouped = context.getCategorizedPresets();
// Returns: { "Amenity": [...], "Shop": [...], ... }
```

**`findPresetByTags(tags)`**
```javascript
const preset = context.findPresetByTags({ amenity: 'restaurant' });
```

**`getStatistics()`**
```javascript
const stats = context.getStatistics();
// Returns counts and metadata
```

## Schema Structure

### Input Format
The library expects OSM iD tagging schema JSON:

```json
{
  "presets": {
    "amenity/restaurant": {
      "name": "Restaurant",
      "icon": "maki-restaurant",
      "tags": { "amenity": "restaurant" },
      "fields": ["name", "cuisine"],
      "terms": ["food", "dining"],
      "reference": "amenity"
    }
  },
  "fields": {
    "name": {
      "key": "name",
      "type": "text",
      "label": "Name"
    }
  }
}
```

### Output Format

Normalized presets include:

```javascript
{
  id: 'amenity/restaurant',
  name: 'Restaurant',
  category: 'Amenity',
  tags: { amenity: 'restaurant' },
  icon: '🍽️',
  fields: ['name', 'cuisine', ...],
  moreFields: ['opening_hours', ...],
  geometry: ['point', 'area'],
  description: '...',
  searchTerms: ['restaurant', 'food', 'dining', ...],
  reference: 'amenity'
}
```

## Inheritance Resolution

The library automatically resolves preset inheritance:

```javascript
// Child preset inherits fields from parent
{
  "amenity": { fields: ["name"] },
  "amenity/restaurant": { 
    reference: "amenity",
    fields: ["cuisine"]  // Will also include "name" from parent
  }
}
```

## Caching

Built-in cache with TTL:

```javascript
import { schemaCache } from './lib/schemaLoader.js';

// Clear cache
schemaCache.clear();

// Check if cached
if (schemaCache.has('key')) {
  const data = schemaCache.get('key');
}
```

## Error Handling

```javascript
try {
  const result = await loadAndParseSchema('/schema.json');
} catch (error) {
  if (error.name === 'SchemaLoaderError') {
    console.error('Failed to load schema:', error.message);
    console.error('Cause:', error.cause);
  }
}
```

## Testing

Run the test suite:

```bash
node src/lib/test.mjs
```

## Examples

### Example 1: Search with Filters

```javascript
// Find all parks
const parks = context.searchPresets('park', {
  category: 'Leisure',
  geometry: 'area'
});
```

### Example 2: Get All Fields for Preset

```javascript
const preset = context.getPresetById('amenity/restaurant');
const { fields, moreFields } = context.getFieldsByPreset(preset.id);

fields.forEach(field => {
  console.log(`${field.label}: ${field.type}`);
});
```

### Example 3: Find Preset by Tags

```javascript
const tags = { amenity: 'restaurant', cuisine: 'pizza' };
const preset = context.findPresetByTags(tags);
```

### Example 4: Get Category Statistics

```javascript
const stats = context.getStatistics();
console.log(stats.categoryCounts);
// { "Amenity": 8, "Shop": 3, "Leisure": 2, ... }
```

## Architecture

```
lib/
├── index.js           # Main exports
├── schemaLoader.js    # Loading & caching
├── schemaParser.js    # Parsing & normalization
├── schemaUtils.js     # Query utilities
└── test.mjs          # Test suite
```

## License

MIT
