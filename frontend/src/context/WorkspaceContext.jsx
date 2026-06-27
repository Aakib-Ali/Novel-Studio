import { createContext, useContext, useMemo, useState } from "react";

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(true);
  const [libraryQuery, setLibraryQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const value = useMemo(
    () => ({
      selectedChapter,
      setSelectedChapter,
      sidePanelOpen,
      setSidePanelOpen,
      libraryQuery,
      setLibraryQuery,
      statusFilter,
      setStatusFilter
    }),
    [selectedChapter, sidePanelOpen, libraryQuery, statusFilter]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}