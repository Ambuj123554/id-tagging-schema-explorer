const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
      <div className="px-4 py-2.5 flex items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <h1 className="text-sm font-semibold text-gray-900">
            OSM Presets Explorer
          </h1>
        </div>
        <div className="ml-4 text-xs text-gray-500">
          iD Tagging Schema
        </div>
      </div>
    </header>
  );
};

export default Header;
