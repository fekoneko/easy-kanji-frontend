import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type GlobalContextValue = {
  section: Section;
  inSectionPath: InSectionPath;
};
type GlobalContextProviderProps = { children: ReactNode };
type Section = 'learn' | 'main' | 'user' | 'edit';
type InSectionPath =
  | 'popular'
  | 'saved'
  | 'search'
  | 'selected'
  | 'by-meaning'
  | 'by-writing'
  | 'user'
  | null;

const IN_SECTION_PATHES = [
  'popular',
  'saved',
  'search',
  'selected',
  'by-meaning',
  'by-writing',
  'user',
];

const globalContext = createContext({} as GlobalContextValue);

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [section, setSection] = useState<Section>('main');
  const [inSectionPath, setInSectionPath] = useState<InSectionPath>(null);
  const location = useLocation();

  useEffect(() => {
    const getSection = (): Section => {
      if (location.pathname.indexOf('/learn') === 0) return 'learn';
      else if (location.pathname.indexOf('/user') === 0) return 'user';
      else if (location.pathname.indexOf('/edit') === 0) return 'edit';
      else return 'main';
    };
    const getInSectionPath = (section: Section): InSectionPath => {
      const uncheckedPath = location.pathname.substring(
        section !== 'main' ? section.length + 2 : 1
      );
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
