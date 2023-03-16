import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type GlobalContextValue = {
  section: Section;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main';

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [section, setSection] = useState<Section>('main');
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.indexOf('/learn') === 0) setSection('learn');
    else setSection('main');
  }, [location.pathname]);

  return <globalContext.Provider value={{ section }}>{children}</globalContext.Provider>;
};

export default globalContext;
