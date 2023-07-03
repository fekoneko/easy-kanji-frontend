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
import { useTranslation } from 'react-i18next';

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
  repeatKanjis: Kanji[];
  setRepeatKanjis: Dispatch<SetStateAction<Kanji[]>>;

  savedKanjisLoading: boolean;
  selectedKanjisLoading: boolean;
};
type KanjiContextProviderProps = { children: ReactNode };

const kanjiContext = createContext({} as KanjiContextValue);

export const KanjiContextProvider = ({ children }: KanjiContextProviderProps) => {
  const { t } = useTranslation();

  const [pageKanjis, setPageKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);
  const [repeatKanjis, setRepeatKanjis] = useState<Kanji[]>([]);

  const [savedKanjisLoading, setSavedKanjisLoading] = useState(false);
  const [selectedKanjisLoading, setSelectedKanjisLoading] = useState(true);

  const [getSelectedErrorStatus, setGetSelectedErrorStatus] = useState<number | null>(null);
  const [getSavedErrorStatus, setGetSavedErrorStatus] = useState<number | null>(null);
  const { showPopup } = usePopup();
  const { auth } = useAuth();

  useEffect(() => {
    const abortController = new AbortController();
    const newSelectedIds = getFromLocalStorage<number[]>('selected');

    if (newSelectedIds) {
      const newSelectedKanjis: Kanji[] = [];

      const getKanjiRange = async (startIndex: number) => {
        const idsToLoad = newSelectedIds.slice(startIndex, startIndex + 200);
        const loadedKanjis = await kanjisApi.getKanjisByIds(
          idsToLoad,
          setGetSelectedErrorStatus,
          undefined,
          abortController.signal
        );
        loadedKanjis?.forEach((kanji, index) => (newSelectedKanjis[startIndex + index] = kanji));
      };

      const getSelectedKanjis = async () => {
        const promises: Promise<void>[] = [];
        for (let i = 0; i < newSelectedIds.length; i += 200) {
          promises.push(getKanjiRange(i));
        }

        for (let i = 0; i < promises.length; i++) await promises[i];
        setSelectedKanjis(newSelectedKanjis);
        setSelectedKanjisLoading(false);
      };
      getSelectedKanjis();
    }

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
    if (getSelectedErrorStatus) showPopup(t('KanjiGrid.Errors.SelectedLoadingFailed'));
  }, [getSelectedErrorStatus]);

  useEffect(() => {
    if (getSavedErrorStatus) showPopup(t('KanjiGrid.Errors.SavedLoadingFailed'));
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
        repeatKanjis,
        setRepeatKanjis,

        selectedKanjisLoading,
        savedKanjisLoading,
      }}
    >
      {children}
    </kanjiContext.Provider>
  );
};

export default kanjiContext;
