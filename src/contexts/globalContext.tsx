import { createContext, ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation, NavigateFunction, Location } from 'react-router-dom';

type GlobalContextValue = {
  navigate: NavigateFunction;
  location: Location;
  section: Section;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main';

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [section, setSection] = useState<Section>('main');

  useEffect(() => {
    if (location.pathname.indexOf('/learn') === 0) setSection('learn');
    else setSection('main');
  }, [location.pathname]);

  return (
    <globalContext.Provider value={{ navigate, location, section }}>
      {children}
    </globalContext.Provider>
  );
};

export default globalContext;
