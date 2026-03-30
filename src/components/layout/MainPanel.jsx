const MainPanel = ({ children }) => {
  return (
    <main className="flex-1 overflow-hidden bg-white">
      {children}
    </main>
  );
};

export default MainPanel;
