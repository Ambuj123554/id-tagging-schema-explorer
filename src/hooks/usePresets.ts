import { useState, useEffect, useMemo } from 'react';
import { loadSchemaFromFile } from '../lib/schemaLoader';
import { parseSchema, presetsToArray } from '../lib/schemaParser';

export const usePresets = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [activeTab, setActiveTab] = useState('presets');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [schemaData, setSchemaData] = useState(null);

  // Load schema data on mount
  useEffect(() => {
    const loadSchema = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load from public folder (accessible via Vite)
        const rawSchema = await loadSchemaFromFile('/sampleSchema.json');
        const parsed = parseSchema(rawSchema);
        
        setSchemaData(parsed);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load schema:', err);
        setError(err.message || 'Failed to load schema');
        setLoading(false);
        
        // Set empty data as fallback
        setSchemaData({
          presets: {},
          fields: {},
          categories: ['All'],
          metadata: { presetCount: 0, fieldCount: 0, categoryCount: 1 }
        });
      }
    };

    loadSchema();
  }, []);

  // Memoize presets array conversion
  const allPresets = useMemo(() => {
    if (!schemaData) return [];
    return presetsToArray(schemaData.presets);
  }, [schemaData]);

  // Memoize fields array conversion
  const fields = useMemo(() => {
    if (!schemaData) return [];
    return Object.values(schemaData.fields);
  }, [schemaData]);

  // Memoize categories
  const categories = useMemo(() => {
    if (!schemaData) return ['All'];
    return schemaData.categories;
  }, [schemaData]);

  // Memoize filtered presets
  const filteredPresets = useMemo(() => {
    if (!allPresets) return [];

    return allPresets.filter(preset => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(preset.tags || {}).some(v => 
          String(v).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (preset.searchTerms && preset.searchTerms.some(term =>
          term.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      // Category filter
      const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allPresets, searchQuery, selectedCategory]);

  // Memoize schema context for components
  const schemaContext = useMemo(() => {
    if (!schemaData) return { presets: {}, getPresetById: () => null };
    
    return {
      presets: schemaData.presets,
      getPresetById: (id) => schemaData.presets[id] || null,
      fields: schemaData.fields,
      metadata: schemaData.metadata
    };
  }, [schemaData]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return {
    searchQuery,
    selectedCategory,
    selectedPreset,
    activeTab,
    filteredPresets,
    allPresets,
    fields,
    categories,
    loading,
    error,
    schemaContext,
    handleSearch,
    handleCategoryChange,
    handlePresetSelect,
    handleTabChange,
  };
};
