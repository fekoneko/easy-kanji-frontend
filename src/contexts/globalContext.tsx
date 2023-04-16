import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type GlobalContextValue = {
  section: Section;
  inSectionPath: InSectionPath;
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

  useEffect(() => {
    const getSection = (): Section => {
      if (location.pathname.indexOf('/learn') === 0) return 'learn';
      else return 'main';
    };
    const getInSectionPath = (section: Section): InSectionPath => {
      const uncheckedPath = location.pathname.substring(section === 'learn' ? 7 : 1);
      if (IN_SECTION_PATHES.includes(uncheckedPath)) return uncheckedPath as InSectionPath;
      else return null;
    };

    const newSection = getSection();
    setSection(newSection);
    const newInSectionPath = getInSectionPath(newSection);
    setInSectionPath(newInSectionPath);
  }, [location.pathname]);

  return (
    <globalContext.Provider value={{ section, inSectionPath }}>{children}</globalContext.Provider>
  );
};

export default globalContext;
