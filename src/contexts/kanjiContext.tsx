import { createContext, ReactNode, useState } from 'react';

export type Kanji = {
  id: number;
  writing: string;
  onReadings: string[];
  kunReadings: string[];
  meaning: string;
};

type KanjiContext = {
  pageKanjis: Kanji[];
  setPageKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
  savedKanjis: Kanji[];
  setSavedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
  selectedKanjis: Kanji[];
  setSelectedKanjis: React.Dispatch<React.SetStateAction<Kanji[]>>;
};
type KanjiContextProviderProps = { children: ReactNode };

const kanjiContext = createContext({} as KanjiContext);

export const KanjiContextProvider = ({ children }: KanjiContextProviderProps) => {
  const [pageKanjis, setPageKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);

  return (
    <kanjiContext.Provider
      value={{
        pageKanjis,
        setPageKanjis,
        savedKanjis,
        setSavedKanjis,
        selectedKanjis,
        setSelectedKanjis,
      }}
    >
      {children}
    </kanjiContext.Provider>
  );
};

export default kanjiContext;
