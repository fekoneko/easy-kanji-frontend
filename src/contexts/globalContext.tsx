import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';

type GlobalContextValue = {
  navigate: NavigateFunction;
  location: Location;
  section: Section;
  lastPressedKey: string | null;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main';

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState<Section>('main');
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setLastPressedKey(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (lastPressedKey !== null) setLastPressedKey(null);
  }, [lastPressedKey]);

  useEffect(() => {
    if (location.pathname.indexOf('/learn') === 0) setSection('learn');
    else setSection('main');
  }, [location.pathname]);

  return (
    <globalContext.Provider value={{ navigate, location, section, lastPressedKey }}>
      {children}
    </globalContext.Provider>
  );
};

export default globalContext;
