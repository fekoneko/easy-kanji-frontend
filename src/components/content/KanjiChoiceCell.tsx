import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import ProtectedContent from './ProtectedContent';
import ControlButton from './ControlButton';
import { ReactComponent as DeleteKanjiIcon } from '../../assets/deleteKanji.svg';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import kanjisApi from '../../api/kanjisApi';
import { removeKanjiFromList } from '../../controllers/kanjiController';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import KanjiCellContent from './KanjiCellContent';

type KanjiChoiceCellProps = {
  kanji: Kanji;
  focus?: boolean;
  setFocus?: () => any;
  detailedMode?: boolean;
  chosenKanji?: Kanji | null;
  setChosenKanji?: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiChoiceCell = ({
  kanji,
  focus,
  setFocus,
  detailedMode,
  chosenKanji,
  setChosenKanji,
}: KanjiChoiceCellProps) => {
  const { t } = useTranslation();
  const [showControls, setShowControls] = useState(false);
  const cellButtonRef = useRef<HTMLButtonElement>(null);
  const { setPageKanjis, setSavedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  const abortControllerRef = useAbortController();
  const [deleteKanjiErrorStatus, setDeleteKanjiErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showPopup } = useToast();

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  useEffect(() => {
    if (deleteKanjiErrorStatus) showPopup(t('KanjiGrid.Errors.DeleteFailed'));
  }, [deleteKanjiErrorStatus]);

  const chooseKanji = () => {
    if (setFocus) setFocus();
    if (setChosenKanji) setChosenKanji((prev) => (prev?.id === kanji.id ? null : kanji));
  };

  const deleteKanji = async () => {
    if (loading) return;

    const deleteSuccess = await kanjisApi.deleteKanji(
      kanji.id,
      setDeleteKanjiErrorStatus,
      setLoading,
      abortControllerRef.current.signal
    );

    if (!deleteSuccess) return;
    removeKanjiFromList(setPageKanjis, kanji);
    removeKanjiFromList(setSavedKanjis, kanji);
    removeKanjiFromList(setSelectedKanjis, kanji);
  };

  return (
    <div
      className={`relative flex items-center border-2 border-gray dark:border-dark-gray [&.selected]:border-black [&.selected]:bg-black [&.selected]:bg-opacity-10 dark:[&.selected]:border-white dark:[&.selected]:bg-white dark:[&.selected]:bg-opacity-10 ${
        kanji.id === chosenKanji?.id ? 'selected' : ''
      }`}
    >
      <button
        tabIndex={focus ? undefined : -1}
        ref={cellButtonRef}
        className="flex-grow px-1 focus:outline-none"
        onClick={chooseKanji}
        onMouseEnter={() => {
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setShowControls(false);
        }}
      >
        <KanjiCellContent kanji={kanji} detailedMode={detailedMode} />
      </button>
      <ProtectedContent allowedRoles={['Admin']}>
        <ControlButton
          shown={focus || showControls || loading}
          title={t('KanjiGrid.Tooltips.Delete')}
          action={() => {
            cellButtonRef.current?.focus();
            deleteKanji();
          }}
        >
          {loading ? <LoadingSpinner small /> : <DeleteKanjiIcon />}
        </ControlButton>
      </ProtectedContent>
    </div>
  );
};
export default KanjiChoiceCell;
