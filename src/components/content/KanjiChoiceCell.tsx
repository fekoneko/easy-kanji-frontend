import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import ProtectedContent from './ProtectedContent';
import ControlButton from './ControlButton';
import { ReactComponent as DeleteKanjiIcon } from '../../assets/images/deleteKanji.svg';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import kanjisApi from '../../api/kanjisApi';
import { removeKanjiFromList } from '../../controllers/kanjiController';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import KanjiCellContent from './KanjiCellContent';
import useLoading from '../../hooks/useLoading';

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
  const [trackKanjiDeletion, kanjiDeletionStatus] = useLoading();
  const { showToast } = useToast();

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  const chooseKanji = () => {
    if (setFocus) setFocus();
    if (setChosenKanji) setChosenKanji((prev) => (prev?.id === kanji.id ? null : kanji));
  };

  const deleteKanji = () => {
    if (kanjiDeletionStatus === 'pending') return;

    trackKanjiDeletion(
      () => kanjisApi.deleteKanji(kanji.id, abortControllerRef.current.signal),
      () => {
        removeKanjiFromList(setPageKanjis, kanji);
        removeKanjiFromList(setSavedKanjis, kanji);
        removeKanjiFromList(setSelectedKanjis, kanji);
      },
      () => showToast(t('KanjiGrid.Errors.DeleteFailed'))
    );
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
          shown={focus || showControls || kanjiDeletionStatus === 'pending'}
          title={t('KanjiGrid.Tooltips.Delete')}
          action={() => {
            cellButtonRef.current?.focus();
            deleteKanji();
          }}
        >
          {kanjiDeletionStatus === 'pending' ? <LoadingSpinner small /> : <DeleteKanjiIcon />}
        </ControlButton>
      </ProtectedContent>
    </div>
  );
};
export default KanjiChoiceCell;
