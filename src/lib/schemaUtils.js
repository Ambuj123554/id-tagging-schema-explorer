/**
 * Schema Utility Functions
 * Provides convenient functions for querying parsed schema data
 */

import { resolveInheritedFields } from './schemaParser.js';

/**
 * Create a schema context that holds parsed data
 */
export class SchemaContext {
  constructor(parsedSchema) {
    this.presets = parsedSchema.presets || {};
    this.fields = parsedSchema.fields || {};
    this.categories = parsedSchema.categories || [];
    this.metadata = parsedSchema.metadata || {};
    
    // Create lookup indices for faster queries
    this._buildIndices();
  }
  
  _buildIndices() {
    // Index presets by category
    this.presetsByCategory = {};
    Object.values(this.presets).forEach(preset => {
      const category = preset.category || 'Other';
      if (!this.presetsByCategory[category]) {
        this.presetsByCategory[category] = [];
      }
      this.presetsByCategory[category].push(preset);
    });
    
    // Index presets by tag keys
    this.presetsByTagKey = {};
    Object.values(this.presets).forEach(preset => {
      if (preset.tags) {
        Object.keys(preset.tags).forEach(tagKey => {
          if (!this.presetsByTagKey[tagKey]) {
            this.presetsByTagKey[tagKey] = [];
          }
          this.presetsByTagKey[tagKey].push(preset);
        });
      }
    });
  }
  
  /**
   * Get preset by ID
   */
  getPresetById(id) {
    return this.presets[id] || null;
  }
  
  /**
   * Get field by ID
   */
  getFieldById(id) {
    return this.fields[id] || null;
  }
  
  /**
   * Get all fields for a preset (resolved with inheritance)
   */
  getFieldsByPreset(presetId) {
    const preset = this.getPresetById(presetId);
    if (!preset) return { fields: [], moreFields: [] };
    
    const fieldObjects = preset.fields
      .map(fieldId => this.getFieldById(fieldId))
      .filter(Boolean);
    
    const moreFieldObjects = preset.moreFields
      .map(fieldId => this.getFieldById(fieldId))
      .filter(Boolean);
    
    return {
      fields: fieldObjects,
      moreFields: moreFieldObjects,
    };
  }
  
  /**
   * Get presets by category
   */
  getPresetsByCategory(category) {
    if (category === 'All') {
      return Object.values(this.presets);
    }
    return this.presetsByCategory[category] || [];
  }
  
  /**
   * Get presets by tag key
   */
  getPresetsByTagKey(tagKey) {
    return this.presetsByTagKey[tagKey] || [];
  }
  
  /**
   * Search presets with various filters
   */
  searchPresets(query, options = {}) {
    const {
      category = 'All',
      geometry = null,
      tags = null,
      matchThreshold = 0,
    } = options;
    
    let results = Object.values(this.presets);
    
    // Filter by searchable
    results = results.filter(preset => preset.searchable !== false);
    
    // Filter by category
    if (category && category !== 'All') {
      results = results.filter(preset => preset.category === category);
    }
    
    // Filter by geometry
    if (geometry) {
      results = results.filter(preset => 
        preset.geometry && preset.geometry.includes(geometry)
      );
    }
    
    // Filter by tags
    if (tags) {
      results = results.filter(preset => {
        if (!preset.tags) return false;
        return Object.entries(tags).every(([key, value]) => 
          preset.tags[key] === value || preset.tags[key] === '*'
        );
      });
    }
    
    // Filter by query string
    if (query && query.trim()) {
      const searchLower = query.toLowerCase().trim();
      results = results.filter(preset => {
        // Search in name
        if (preset.name.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in description
        if (preset.description && preset.description.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Search in search terms
        if (preset.searchTerms && preset.searchTerms.some(term => 
          term.includes(searchLower)
        )) {
          return true;
        }
        
        // Search in tag values
        if (preset.tags) {
          const tagValues = Object.values(preset.tags).map(v => String(v).toLowerCase());
          if (tagValues.some(v => v.includes(searchLower))) {
            return true;
          }
        }
        
        return false;
      });
    }
    
    // Sort by relevance (name match first, then category, then alphabetically)
    if (query && query.trim()) {
      const searchLower = query.toLowerCase().trim();
      results.sort((a, b) => {
        const aNameMatch = a.name.toLowerCase().startsWith(searchLower);
        const bNameMatch = b.name.toLowerCase().startsWith(searchLower);
        
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        
        return a.name.localeCompare(b.name);
      });
    } else {
      results.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return results;
  }
  
  /**
   * Get categorized presets (grouped by category)
   */
  getCategorizedPresets() {
    const categorized = {};
    
    this.categories.forEach(category => {
      if (category !== 'All') {
        categorized[category] = this.getPresetsByCategory(category);
      }
    });
    
    return categorized;
  }
  
  /**
   * Find preset by tags (most specific match)
   */
  findPresetByTags(tags) {
    const matches = Object.values(this.presets).filter(preset => {
      if (!preset.tags) return false;
      
      return Object.entries(preset.tags).every(([key, value]) => {
        if (value === '*') {
          return tags[key] !== undefined;
        }
        return tags[key] === value;
      });
    });
    
    // Return most specific match (preset with most tags)
    if (matches.length === 0) return null;
    
    return matches.reduce((best, current) => {
      const bestTagCount = Object.keys(best.tags).length;
      const currentTagCount = Object.keys(current.tags).length;
      return currentTagCount > bestTagCount ? current : best;
    });
  }
  
  /**
   * Get statistics about the schema
   */
  getStatistics() {
    return {
      ...this.metadata,
      categoryCounts: Object.fromEntries(
        Object.entries(this.presetsByCategory).map(([cat, presets]) => [
          cat,
          presets.length,
        ])
      ),
      tagKeyCounts: Object.fromEntries(
        Object.entries(this.presetsByTagKey).map(([key, presets]) => [
          key,
          presets.length,
        ])
      ),
    };
  }
}

/**
 * Convenience function to create context from parsed schema
 */
export const createSchemaContext = (parsedSchema) => {
  return new SchemaContext(parsedSchema);
};

/**
 * Legacy function wrappers for backward compatibility
 */
let globalContext = null;

export const setGlobalContext = (context) => {
  globalContext = context;
};

export const getPresetById = (id) => {
  if (!globalContext) throw new Error('Global context not initialized');
  return globalContext.getPresetById(id);
};

export const resolveInheritedFieldsForPreset = (preset) => {
  if (!globalContext) throw new Error('Global context not initialized');
  return resolveInheritedFields(preset, globalContext.presets);
};

export const searchPresets = (query, options) => {
  if (!globalContext) throw new Error('Global context not initialized');
  return globalContext.searchPresets(query, options);
};

export const getFieldsByPreset = (presetId) => {
  if (!globalContext) throw new Error('Global context not initialized');
  return globalContext.getFieldsByPreset(presetId);
};

export const getCategorizedPresets = () => {
  if (!globalContext) throw new Error('Global context not initialized');
  return globalContext.getCategorizedPresets();
};
