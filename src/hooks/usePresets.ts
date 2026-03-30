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

  useEffect(() => {
    const loadSchema = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const rawSchema = await loadSchemaFromFile('/sampleSchema.json');
        const parsed = parseSchema(rawSchema);
        
        setSchemaData(parsed);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load schema:', err);
        setError(err.message || 'Failed to load schema');
        setLoading(false);
        
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

  const allPresets = useMemo(() => {
    if (!schemaData) return [];
    return presetsToArray(schemaData.presets);
  }, [schemaData]);

  const fields = useMemo(() => {
    if (!schemaData) return [];
    return Object.values(schemaData.fields);
  }, [schemaData]);

  const categories = useMemo(() => {
    if (!schemaData) return ['All'];
    return schemaData.categories;
  }, [schemaData]);

  const filteredPresets = useMemo(() => {
    if (!allPresets) return [];

    return allPresets.filter(preset => {
      const matchesSearch = searchQuery === '' ||
        preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        Object.values(preset.tags || {}).some(v => 
          String(v).toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (preset.searchTerms && preset.searchTerms.some(term =>
          term.toLowerCase().includes(searchQuery.toLowerCase())
        ));

      const matchesCategory = selectedCategory === 'All' || preset.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allPresets, searchQuery, selectedCategory]);

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
