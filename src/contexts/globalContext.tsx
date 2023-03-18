import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type Auth = {
  username: string;
  password: string;
  roles: Array<number>;
  accessToken: string;
};

type GlobalContextValue = {
  section: Section;
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main';

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [section, setSection] = useState<Section>('main');
  const location = useLocation();
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    if (location.pathname.indexOf('/learn') === 0) setSection('learn');
    else setSection('main');
  }, [location.pathname]);

  return (
    <globalContext.Provider value={{ section, auth, setAuth }}>{children}</globalContext.Provider>
  );
};

export default globalContext;
