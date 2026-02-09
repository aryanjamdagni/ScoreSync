import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UIContext = createContext(null);

const STORAGE_KEY = "scoresync_ui";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStored(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    
  }
}

export function UIProvider({ children }) {
  const stored = readStored();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    stored?.sidebarCollapsed ?? false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    writeStored({ sidebarCollapsed });
  }, [sidebarCollapsed]);

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      setSidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),

      mobileSidebarOpen,
      setMobileSidebarOpen,
      openMobileSidebar: () => setMobileSidebarOpen(true),
      closeMobileSidebar: () => setMobileSidebarOpen(false),
      toggleMobileSidebar: () => setMobileSidebarOpen((v) => !v),
    }),
    [sidebarCollapsed, mobileSidebarOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);

  if (!ctx) {
    return {
      sidebarCollapsed: false,
      setSidebarCollapsed: () => {},
      toggleSidebar: () => {},

      mobileSidebarOpen: false,
      setMobileSidebarOpen: () => {},
      openMobileSidebar: () => {},
      closeMobileSidebar: () => {},
      toggleMobileSidebar: () => {},
    };
  }

  return ctx;
}
