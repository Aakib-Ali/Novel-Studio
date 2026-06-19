import { createContext, useContext, useMemo, useState } from 'react';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [createBookOpen, setCreateBookOpen] = useState(false);
  const [editorChapter, setEditorChapter] = useState(null);
  const [blocking, setBlocking] = useState(false);

  const value = useMemo(() => ({
    createBookOpen,
    setCreateBookOpen,
    editorChapter,
    setEditorChapter,
    blocking,
    setBlocking
  }), [createBookOpen, editorChapter, blocking]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}