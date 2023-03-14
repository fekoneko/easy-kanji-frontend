import { createContext, ReactNode, useEffect, useState } from 'react';

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
    const testKanjis = [
      {
        id: 1,
        writing: '人',
        onReadings: ['ニン', 'ジン'],
        kunReadings: ['ひと'],
        meaning: 'человек',
      },
      {
        id: 2,
        writing: '人',
        onReadings: ['ニン', 'ジン'],
        kunReadings: ['ひと'],
        meaning: 'человек',
      },
      {
        id: 3,
        writing: '人',
        onReadings: ['ニン', 'ジン'],
        kunReadings: ['ひと'],
        meaning: 'человек',
      },
    ];
    setPopularKanjis(testKanjis);
    setSavedKanjis(testKanjis);
    setSearchKanjis(testKanjis);
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
