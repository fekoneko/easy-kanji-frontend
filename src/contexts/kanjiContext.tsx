import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import kanjisApi from '../api/kanjisApi';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';
import { addKanjisToList, getKanjisIds } from '../controllers/kanjiController';

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

  const selectedKanjisLoaded = useRef(false);
  const savedKanjisFetched = useRef(false);

  useEffect(() => {
    const loadSelectedKanjis = async () => {
      selectedKanjisLoaded.current = false;
      const newSelectedIds = getFromLocalStorage<number[]>('selected');
      if (newSelectedIds && newSelectedIds.length > 0) {
        const newSelectedKanjis = await kanjisApi.getKanjisByIds(newSelectedIds);
        if (newSelectedKanjis) addKanjisToList(setSelectedKanjis, newSelectedKanjis);
      }
      selectedKanjisLoaded.current = true;
    };
    loadSelectedKanjis();
  }, []);

  useEffect(() => {
    if (!selectedKanjisLoaded.current) return;
    const saveSelectedKanjis = () => {
      const selectedKanjisIds = getKanjisIds(selectedKanjis);
      setInLocalStorage('selected', selectedKanjisIds);
    };
    saveSelectedKanjis();
  }, [selectedKanjis]);

  useEffect(() => {
    const fetchSavedKanjis = async () => {
      const newSavedKanjis = await kanjisApi.getKanjiList('saved');
      if (newSavedKanjis) addKanjisToList(setSavedKanjis, newSavedKanjis);
    };
    fetchSavedKanjis();
  }, []);

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
