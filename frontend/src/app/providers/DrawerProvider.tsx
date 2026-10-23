import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type DrawerTarget = { type: 'section'; id: string } | { type: 'field'; key: string };

interface DrawerContextValue {
  target: DrawerTarget | null;
  openSection: (id: string) => void;
  openField: (key: string) => void;
  close: () => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<DrawerTarget | null>(null);
  const openSection = useCallback((id: string) => setTarget({ type: 'section', id }), []);
  const openField = useCallback((key: string) => setTarget({ type: 'field', key }), []);
  const close = useCallback(() => setTarget(null), []);
  const value = useMemo(() => ({ target, openSection, openField, close }), [target, openSection, openField, close]);
  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export function useDrawer(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer muss innerhalb von DrawerProvider verwendet werden.');
  return ctx;
}
