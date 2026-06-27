import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [createBookOpen, setCreateBookOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);

  const value = useMemo(
    () => ({
      createBookOpen,
      setCreateBookOpen,
      blocking,
      setBlocking
    }),
    [createBookOpen, blocking]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}