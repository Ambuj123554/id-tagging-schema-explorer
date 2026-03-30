import { useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MainPanel from './components/layout/MainPanel';
import SearchBar from './components/search/SearchBar';
import PresetList from './components/presets/PresetList';
import PresetDetail from './components/presets/PresetDetail';
import FieldsView from './components/presets/FieldsView';
import RelationshipsView from './components/presets/RelationshipsView';
import { usePresets } from './hooks/usePresets';

function App() {
  const {
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
  } = usePresets();

  useEffect(() => {
    if (activeTab !== 'presets' || filteredPresets.length === 0) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      const currentIndex = selectedPreset
        ? filteredPresets.findIndex(p => p.id === selectedPreset.id)
        : -1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = currentIndex < filteredPresets.length - 1 ? currentIndex + 1 : 0;
        handlePresetSelect(filteredPresets[nextIndex]);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredPresets.length - 1;
        handlePresetSelect(filteredPresets[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, filteredPresets, selectedPreset, handlePresetSelect]);

  const renderMainContent = () => {
    switch (activeTab) {
      case 'presets':
        return (
          <div className="flex h-full">
            <div className="w-80 border-r border-gray-200 flex flex-col bg-white flex-shrink-0">
              <SearchBar
                value={searchQuery}
                onChange={handleSearch}
                allPresets={allPresets}
                onSelectSuggestion={handlePresetSelect}
                placeholder="Search presets..."
              />
              <PresetList
                presets={filteredPresets}
                onSelect={handlePresetSelect}
                selectedPreset={selectedPreset}
                searchQuery={searchQuery}
              />
            </div>
            <div className="flex-1">
              <PresetDetail
                preset={selectedPreset}
                fields={fields}
                schemaContext={schemaContext}
                searchQuery={searchQuery}
                onSelectPreset={handlePresetSelect}
              />
            </div>
          </div>
        );

      case 'fields':
        return <FieldsView fields={fields} />;

      case 'relationships':
        return <RelationshipsView presets={allPresets} />;

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
            <p className="text-sm text-gray-600">Loading schema...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-gray-900 font-semibold mb-1">Failed to load schema</p>
            <p className="text-xs text-gray-600">{error}</p>
            <p className="text-xs text-gray-500 mt-3">Using fallback data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <MainPanel>{renderMainContent()}</MainPanel>
      </div>
    </div>
  );
}

export default App;
