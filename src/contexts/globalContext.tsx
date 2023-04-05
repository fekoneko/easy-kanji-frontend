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
  inSectionPath: InSectionPath;
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main';
type InSectionPath =
  | 'popular'
  | 'saved'
  | 'search'
  | 'selected'
  | 'by-meaning'
  | 'by-writing'
  | null;

const IN_SECTION_PATHES = ['popular', 'saved', 'search', 'selected', 'by-meaning', 'by-writing'];

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [section, setSection] = useState<Section>('main');
  const [inSectionPath, setInSectionPath] = useState<InSectionPath>(null);
  const location = useLocation();
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const getSection = (): Section => {
      if (location.pathname.indexOf('/learn') === 0) return 'learn';
      else return 'main';
    };
    const getInSectionPath = (section: Section): InSectionPath => {
      const uncheckedPath = location.pathname.substring(section === 'learn' ? 7 : 1);
      console.log(uncheckedPath);
      if (IN_SECTION_PATHES.includes(uncheckedPath)) return uncheckedPath as InSectionPath;
      else return null;
    };

    const newSection = getSection();
    setSection(newSection);
    const newInSectionPath = getInSectionPath(newSection);
    setInSectionPath(newInSectionPath);
  }, [location.pathname]);

  return (
    <globalContext.Provider value={{ section, inSectionPath, auth, setAuth }}>
      {children}
    </globalContext.Provider>
  );
};

export default globalContext;
