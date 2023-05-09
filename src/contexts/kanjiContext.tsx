import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';
import { addKanjisToList, getKanjisIds } from '../controllers/kanjiController';
import kanjisApi from '../api/kanjisApi';
import useAuth from '../hooks/useAuth';
import usersApi from '../api/usersApi';
import usePopup from '../hooks/usePopup';

export type Kanji = {
  id: number;
  writing: string;
  onReadings: string[];
  kunReadings: string[];
  meaning: string;
};

type KanjiContextValue = {
  pageKanjis: Kanji[];
  setPageKanjis: Dispatch<SetStateAction<Kanji[]>>;
  savedKanjis: Kanji[];
  setSavedKanjis: Dispatch<SetStateAction<Kanji[]>>;
  selectedKanjis: Kanji[];
  setSelectedKanjis: Dispatch<SetStateAction<Kanji[]>>;

  savedKanjisLoading: boolean;
  selectedKanjisLoading: boolean;
};
type KanjiContextProviderProps = { children: ReactNode };

const kanjiContext = createContext({} as KanjiContextValue);

export const KanjiContextProvider = ({ children }: KanjiContextProviderProps) => {
  const [pageKanjis, setPageKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);

  const [savedKanjisLoading, setSavedKanjisLoading] = useState(false);
  const [selectedKanjisLoading, setSelectedKanjisLoading] = useState(true);

  const [getSelectedErrorStatus, setGetSelectedErrorStatus] = useState<number | null>(null);
  const [getSavedErrorStatus, setGetSavedErrorStatus] = useState<number | null>(null);
  const { showPopup } = usePopup();
  const { auth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();

    const loadSelectedKanjis = async () => {
      const newSelectedIds = getFromLocalStorage<number[]>('selected');
      if (newSelectedIds && newSelectedIds.length > 0) {
        const newSelectedKanjis = await kanjisApi.getKanjisByIds(
          newSelectedIds,
          setGetSelectedErrorStatus,
          setSelectedKanjisLoading,
          abortController.signal
        );
        if (newSelectedKanjis) addKanjisToList(setSelectedKanjis, newSelectedKanjis);
      }
    };
    loadSelectedKanjis();

    return () => {
      abortController.abort();
      setSelectedKanjisLoading(false);
    };
  }, []);

  useEffect(() => {
    if (selectedKanjisLoading) return;

    const saveSelectedKanjis = () => {
      const selectedKanjisIds = getKanjisIds(selectedKanjis);
      setInLocalStorage('selected', selectedKanjisIds);
    };
    saveSelectedKanjis();
  }, [selectedKanjis, selectedKanjisLoading]);

  useEffect(() => {
    if (!auth) return;
    const abortController = new AbortController();

    const fetchSavedKanjis = async () => {
      const newSavedKanjis = await usersApi.getSavedKanjis(
        setGetSavedErrorStatus,
        setSavedKanjisLoading,
        abortController.signal
      );
      setSavedKanjis(newSavedKanjis ?? []);
    };
    fetchSavedKanjis();

    return () => {
      setSavedKanjis([]);
      abortController.abort();
      setSavedKanjisLoading(false);
    };
  }, [auth]);

  useEffect(() => {
    if (getSelectedErrorStatus) showPopup('Ошибка загрузки выдененных кандзи');
  }, [getSelectedErrorStatus]);

  useEffect(() => {
    if (getSavedErrorStatus) showPopup('Ошибка загрузки сохранённых кандзи');
  }, [getSavedErrorStatus]);

  return (
    <kanjiContext.Provider
      value={{
        pageKanjis,
        setPageKanjis,
        savedKanjis,
        setSavedKanjis,
        selectedKanjis,
        setSelectedKanjis,

        selectedKanjisLoading,
        savedKanjisLoading,
      }}
    >
      {children}
    </kanjiContext.Provider>
  );
};

export default kanjiContext;
