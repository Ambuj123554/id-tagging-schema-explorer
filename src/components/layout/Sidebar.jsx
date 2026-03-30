const Sidebar = ({ activeTab, onTabChange, categories, selectedCategory, onCategoryChange }) => {
  const tabs = [
    { id: 'presets', label: 'Presets' },
    { id: 'fields', label: 'Fields' },
    { id: 'relationships', label: 'Relationships' },
  ];

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <nav className="py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full px-4 py-1.5 text-left text-sm transition-colors duration-150 ${
              activeTab === tab.id
                ? 'bg-gray-200 text-gray-900 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === 'presets' && (
        <>
          <div className="mt-4 px-4 pb-2 border-t border-gray-200 pt-4">
            <h3 className="text-xs font-bold uppercase text-gray-500 tracking-wide">
              Categories
            </h3>
          </div>
          <div className="px-2 pb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`w-full px-2 py-1 text-sm text-left transition-colors duration-150 ${
                  selectedCategory === category
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
