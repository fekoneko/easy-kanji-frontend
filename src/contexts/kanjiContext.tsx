import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { getFromLocalStorage, setInLocalStorage } from '../controllers/localStorageController';
import { addKanjisToList, getKanjisIds } from '../controllers/kanjiController';
import kanjisApi from '../api/kanjisApi';
import useAuth from '../hooks/useAuth';
import usersApi from '../api/usersApi';
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
  pageKanjis: Kanji[];
  setPageKanjis: Dispatch<SetStateAction<Kanji[]>>;
  savedKanjis: Kanji[];
  setSavedKanjis: Dispatch<SetStateAction<Kanji[]>>;
  selectedKanjis: Kanji[];
  setSelectedKanjis: Dispatch<SetStateAction<Kanji[]>>;
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

  const [pageKanjis, setPageKanjis] = useState<Kanji[]>([]);
  const [savedKanjis, setSavedKanjis] = useState<Kanji[]>([]);
  const [selectedKanjis, setSelectedKanjis] = useState<Kanji[]>([]);
  const [repeatKanjis, setRepeatKanjis] = useState<Kanji[]>([]);

  const [trackSelectedLoading, selectedLoadingStatus, selectedLoadingError] = useLoading();
  const [trackSavedLoading, savedLoadingStatus, savedLoadingError] = useLoading();
  const abortControllerRef = useAbortController();
  const { showToast } = useToast();
  const { auth } = useAuth();

  useEffect(() => {
    const newSelectedIds = getFromLocalStorage<number[]>('selected');
    if (newSelectedIds && newSelectedIds.length > 0) {
      trackSelectedLoading(
        () => kanjisApi.getKanjisByIds(newSelectedIds, abortControllerRef.current.signal),
        (newSelectedKanjis) => addKanjisToList(setSelectedKanjis, newSelectedKanjis as Kanji[]),
        () => showToast(t('KanjiGrid.Errors.SelectedLoadingFailed'))
      );
    }
  }, []);

  useEffect(() => {
    if (selectedLoadingStatus !== 'done') return;

    const selectedKanjisIds = getKanjisIds(selectedKanjis);
    setInLocalStorage('selected', selectedKanjisIds);
  }, [selectedKanjis, selectedLoadingStatus]);

  useEffect(() => {
    if (!auth) return;

    trackSavedLoading(
      () => usersApi.getSavedKanjis(abortControllerRef.current.signal),
      (newSavedKanjis) => setSavedKanjis(newSavedKanjis as Kanji[]),
      () => showToast(t('KanjiGrid.Errors.SavedLoadingFailed'))
    );

    return () => setSavedKanjis([]);
  }, [auth?.id]);

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
