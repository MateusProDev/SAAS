// src/hooks/useRefreshSitesContext.tsx
import React, { createContext, useContext, useRef } from 'react';

// Contexto para expor a função de refresh globalmente
const RefreshSitesContext = createContext<{ refresh?: () => Promise<void> }>({});

export function RefreshSitesProvider({ children, refresh }: { children: React.ReactNode, refresh: () => Promise<void> }) {
  // Usa ref para evitar re-render
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;
  return (
    <RefreshSitesContext.Provider value={{ refresh: refreshRef.current }}>
      {children}
    </RefreshSitesContext.Provider>
  );
}

export function useRefreshSites() {
  return useContext(RefreshSitesContext).refresh;
}
