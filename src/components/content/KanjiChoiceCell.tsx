import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import ProtectedContent from './ProtectedContent';
import ControlButton from './ControlButton';
import { ReactComponent as DeleteKanjiIcon } from '../../assets/deleteKanji.svg';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';
import kanjisApi from '../../api/kanjisApi';
import { removeKanjiFromList } from '../../controllers/kanjiController';
import LoadingSpinner from '../animations/LoadingSpinner';
import KanjiReadings from './KanjiReadings';

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
  const [showControls, setShowControls] = useState(false);
  const cellButtonRef = useRef<HTMLButtonElement>(null);
  const { setPageKanjis, setSavedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  const abortControllerRef = useAbortController();
  const [deleteKanjiErrorStatus, setDeleteKanjiErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  useEffect(() => {
    if (deleteKanjiErrorStatus) showPopup('Ошибка удаления кандзи');
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
    <div className={`kanjiCell${kanji.id === chosenKanji?.id ? ' selected' : ''}`}>
      <button
        tabIndex={focus ? undefined : -1}
        ref={cellButtonRef}
        className="kanjiCellButton"
        onClick={chooseKanji}
        onMouseEnter={() => {
          setShowControls(true);
        }}
        onMouseLeave={() => {
          setShowControls(false);
        }}
      >
        <p className="kanjiWriting">{kanji.writing}</p>
        <div>
          <p className="kanjiMeaning">{kanji.meaning}</p>
          {detailedMode && (
            <>
              <p className="kanjiOnReadings">
                <KanjiReadings readings={kanji.onReadings} />
              </p>
              <p className="kanjiKunReadings">
                <KanjiReadings readings={kanji.kunReadings} />
              </p>
            </>
          )}
        </div>
      </button>
      <ProtectedContent allowedRoles={['Admin']}>
        <ControlButton
          shown={focus || showControls || loading}
          title={'Удалить кандзи'}
          action={() => {
            cellButtonRef.current?.focus();
            deleteKanji();
          }}
        >
          {loading ? <LoadingSpinner /> : <DeleteKanjiIcon />}
        </ControlButton>
      </ProtectedContent>
    </div>
  );
};
export default KanjiChoiceCell;
