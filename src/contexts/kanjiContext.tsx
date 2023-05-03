import { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';
import { addKanjisToList, getKanjisIds } from '../controllers/kanjiController';
import kanjisApi from '../api/kanjisApi';
import useAuth from '../hooks/useAuth';
import usersApi from '../api/usersApi';

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

  const selectedKanjisLoaded = useRef(false);
  const { auth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    const loadSelectedKanjis = async () => {
      selectedKanjisLoaded.current = false;
      const newSelectedIds = getFromLocalStorage<number[]>('selected');
      if (newSelectedIds && newSelectedIds.length > 0) {
        const newSelectedKanjis = await kanjisApi.getKanjisByIds(
          newSelectedIds,
          undefined,
          abortController.signal
        );
        if (newSelectedKanjis) addKanjisToList(setSelectedKanjis, newSelectedKanjis);
      }
      selectedKanjisLoaded.current = true;
    };
    loadSelectedKanjis();

    return () => {
      abortController.abort();
      selectedKanjisLoaded.current = false;
    };
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
    if (!auth) return;
    const abortController = new AbortController();

    const fetchSavedKanjis = async () => {
      const newSavedKanjis = await usersApi.getSavedKanjis(undefined, abortController.signal);
      if (newSavedKanjis) addKanjisToList(setSavedKanjis, newSavedKanjis);
    };
    fetchSavedKanjis();

    return () => abortController.abort();
  }, [auth]);

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
