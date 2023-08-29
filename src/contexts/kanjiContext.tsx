import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';
import { addKanjisToList, getKanjisIds } from '../controllers/kanjiController';
import kanjisApi from '../api/kanjisApi';
import useAuth from '../hooks/useAuth';
import usersApi, { UserInfo } from '../api/usersApi';
import useToast from '../hooks/useToast';
import { useTranslation } from 'react-i18next';
import useLoading, { Status } from '../hooks/useLoading';
import useAbortController from '../hooks/useAbortController';
import { ApiErrorMessage } from '../api/ApiError';

export type Kanji = {
  id: number;
  writing: string;
  onReadings: string[];
  kunReadings: string[];
  meaning: string;
};

type KanjiContextValue = {
  popularKanjis: Kanji[];
  setPopularKanjis: Dispatch<SetStateAction<Kanji[]>>;
  savedKanjis: Kanji[];
  setSavedKanjis: Dispatch<SetStateAction<Kanji[]>>;
  selectedKanjis: Kanji[];
  setSelectedKanjis: Dispatch<SetStateAction<Kanji[]>>;
  searchKanjis: Kanji[];
  setSearchKanjis: Dispatch<SetStateAction<Kanji[]>>;
  learnKanjis: Kanji[];
  setLearnKanjis: Dispatch<SetStateAction<Kanji[]>>;
  repeatKanjis: Kanji[];
  setRepeatKanjis: Dispatch<SetStateAction<Kanji[]>>;

  savedLoadingStatus: Status | null;
  savedLoadingError: ApiErrorMessage | null;
  selectedLoadingStatus: Status | null;
  selectedLoadingError: ApiErrorMessage | null;
};
type KanjiContextProviderProps = { children: ReactNode };

const kanjiContext = createContext({} as KanjiContextValue);

export const KanjiContextProvider = ({ children }: KanjiContextProviderProps) => {
  const { t } = useTranslation();

  const [popularKanjis, setPopularKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);
  const [searchKanjis, setSearchKanjis] = useState<Kanji[]>([]);
  const [learnKanjis, setLearnKanjis] = useState<Kanji[]>([]);
  const [repeatKanjis, setRepeatKanjis] = useState<Kanji[]>([]);

  const [allowedToSave, setAllowedToSave] = useState(false);
  const [trackSelectedLoading, selectedLoadingStatus, selectedLoadingError] = useLoading();
  const [trackSavedLoading, savedLoadingStatus, savedLoadingError] = useLoading();
  const abortControllerRef = useAbortController();
  const { showToast } = useToast();
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    const loadSelectedKanjis = async () => {
      const newSelectedIds = getFromLocalStorage<number[]>('selected');
      if (newSelectedIds && newSelectedIds.length > 0) {
        await trackSelectedLoading(
          () => kanjisApi.getKanjisByIds(newSelectedIds, abortControllerRef.current.signal),
          (newSelectedKanjis) => {
            addKanjisToList(setSelectedKanjis, newSelectedKanjis as Kanji[]);
            setAllowedToSave(true);
          },
          () => showToast(t('KanjiGrid.Errors.SelectedLoadingFailed'))
        );
      } else setAllowedToSave(true);
    };
    loadSelectedKanjis();
  }, []);

  useEffect(() => {
    if (!allowedToSave) return;

    const selectedKanjisIds = getKanjisIds(selectedKanjis);
    setInLocalStorage('selected', selectedKanjisIds);
  }, [selectedKanjis, selectedLoadingStatus]);

  useEffect(() => {
    if (auth) {
      trackSavedLoading(
        () => usersApi.getUserInfo(abortControllerRef.current.signal),
        (userInfo) => {
          if (!auth.accessToken) return;
          setAuth((prev) => (prev ? { ...prev, ...(userInfo as UserInfo) } : null));
          setSavedKanjis((userInfo as UserInfo).savedKanjis);
        },
        () => showToast(t('KanjiGrid.Errors.SavedLoadingFailed'))
      );
    }

    return () => setSavedKanjis([]);
  }, [auth?.id]);

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
        learnKanjis,
        setLearnKanjis,
        repeatKanjis,
        setRepeatKanjis,

        selectedLoadingStatus,
        selectedLoadingError,
        savedLoadingStatus,
        savedLoadingError,
      }}
    >
      {children}
    </kanjiContext.Provider>
  );
};

export default kanjiContext;
