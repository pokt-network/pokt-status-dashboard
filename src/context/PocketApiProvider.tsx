"use client";

import { createContext, useContext, ReactNode } from 'react';
import { PocketApi } from '@/utils/api';

interface PocketApiContextType {
  api: PocketApi;
}

const PocketApiContext = createContext<PocketApiContextType | undefined>(undefined);

interface PocketApiProviderProps {
  api: PocketApi;
  children: ReactNode;
}

export function PocketApiProvider({ api, children }: PocketApiProviderProps) {
  return (
    <PocketApiContext.Provider value={{ api }}>
      {children}
    </PocketApiContext.Provider>
  );
}

export function usePocketApi() {
  const context = useContext(PocketApiContext);
  if (context === undefined) {
    throw new Error('usePocketApi must be used within a PocketApiProvider');
  }
  return context.api;
}
