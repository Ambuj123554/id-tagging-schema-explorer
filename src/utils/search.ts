export const highlightText = (text: string, query: string): string[] => {
  if (!query || !text) return [text];

  const regex = new RegExp(`(${query})`, 'gi');
  return text.split(regex).filter(Boolean);
};

export const getSearchSuggestions = (presets: any[], query: string, limit = 10) => {
  if (!query) return [];

  const lowerQuery = query.toLowerCase();
  return presets
    .filter(preset =>
      preset.name.toLowerCase().includes(lowerQuery) ||
      Object.values(preset.tags || {}).some((v: any) =>
        v.toLowerCase().includes(lowerQuery)
      )
    )
    .slice(0, limit);
};
