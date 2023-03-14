import { createContext, ReactNode, useEffect, useState } from 'react';
import testKanjiData from './testKanjiData.json';

export type Kanji = {
  id: number;
  writing: string;
  onReadings: string[];
  kunReadings: string[];
  meaning: string;
};

type KanjiContext = {
  popularKanjis: Kanji[];
  setPopularKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
  savedKanjis: Kanji[];
  setSavedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
  searchKanjis: Kanji[];
  setSearchKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
  selectedKanjis: Kanji[];
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
};
type KanjiContextProviderProps = { children: ReactNode };

const kanjiContext = createContext({} as KanjiContext);

export const KanjiContextProvider = ({ children }: KanjiContextProviderProps) => {
  const [popularKanjis, setPopularKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [searchKanjis, setSearchKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);

  useEffect(() => {
    setPopularKanjis(testKanjiData.popular);
    setSavedKanjis(testKanjiData.saved);
    setSearchKanjis(testKanjiData.search);
  }, []); // TODO: remove + remove import

  return (
    <kanjiContext.Provider
      value={{
        popularKanjis,
        setPopularKanjis,
        savedKanjis,
        setSavedKanjis,
        searchKanjis,
        setSearchKanjis,
        selectedKanjis,
        setSelectedKanjis,
      }}
    >
      {children}
    </kanjiContext.Provider>
  );
};

export default kanjiContext;
