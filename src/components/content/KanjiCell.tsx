import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import { isKanjiInList, changeKanjiInList } from '../../controllers/kanjiController';
import ControlButton from './ControlButton';
import KanjiView from './KanjiView';
import Tooltip from '../overlays/Tooltip';
import { ReactComponent as SaveKanjiIcon } from '../../assets/saveKanji.svg';
import { ReactComponent as KanjiSavedIcon } from '../../assets/kanjiSaved.svg';
import useOnClick from '../../hooks/useOnClick';
import usersApi from '../../api/usersApi';
import ProtectedContent from './ProtectedContent';
import useModal from '../../hooks/useModal';
import AuthModal from '../overlays/AuthModal';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';
import LoadingSpinner from '../animations/LoadingSpinner';
import authContext from '../../contexts/authContext';
import useOnKeyUp from '../../hooks/useOnKeyUp';
import { useTranslation } from 'react-i18next';
import KanjiCellContent from './KanjiCellContent';

type KanjiCellProps = {
  kanji: Kanji;
  focus?: boolean;
  setFocus?: () => any;
  detailedMode?: boolean;
};

const KanjiCell = ({ kanji, focus, setFocus, detailedMode }: KanjiCellProps) => {
  const { t } = useTranslation();
  const { selectedKanjis, setSelectedKanjis, savedKanjis, setSavedKanjis } =
    useContext(kanjiContext);
  const { auth } = useContext(authContext);
  const { showModal } = useModal();
  const cellButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  const showTimeoutRef = useRef<number | null>(null);
  const [showControls, setShowControls] = useState(false);
  const kanjiSaved = useMemo(() => isKanjiInList(savedKanjis, kanji), [savedKanjis]);
  const kanjiSelected = useMemo(() => isKanjiInList(selectedKanjis, kanji), [selectedKanjis]);

  const abortControllerRef = useAbortController();
  const [saveKanjiErrorStatus, setSaveKanjiErrorStatus] = useState<number | null>(null);
  const [removeKanjiErrorStatus, setRemoveKanjiErrorStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { showPopup } = usePopup();

  const selectKanji = () => changeKanjiInList(setSelectedKanjis, kanji);

  const saveKanji = async () => {
    if (loading || !auth) return;

    if (kanjiSaved) {
      const removeSuccess = await usersApi.removeKanjisFromSaved(
        [kanji.id],
        setRemoveKanjiErrorStatus,
        setLoading,
        abortControllerRef.current.signal
      );
      if (!removeSuccess) return;
    } else {
      const saveSuccess = await usersApi.saveKanjis(
        [kanji.id],
        setSaveKanjiErrorStatus,
        setLoading,
        abortControllerRef.current.signal
      );
      if (!saveSuccess) return;
    }
    changeKanjiInList(setSavedKanjis, kanji);
  };

  useEffect(() => {
    if (saveKanjiErrorStatus) showPopup(t('KanjiGrid.Errors.SaveFailed'));
  }, [saveKanjiErrorStatus]);

  useEffect(() => {
    if (removeKanjiErrorStatus) showPopup(t('KanjiGrid.Errors.RemoveFailed'));
  }, [removeKanjiErrorStatus]);

  useOnClick(
    cellButtonRef,
    () => {
      selectKanji();
      if (setFocus) setFocus();
    },
    'inside'
  );

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  useOnKeyUp('Enter', () => focus && saveKanji(), [focus]);
  useOnKeyUp(' ', () => focus && selectKanji(), [focus]);

  const waitAndShowTooltip = () => {
    const showTooltip = () => {
      if (!cellButtonRef.current) return;
      setTooltipShown(true);
    };
    if (showTimeoutRef.current !== null) clearTimeout(showTimeoutRef.current);
    showTimeoutRef.current = setTimeout(showTooltip, 200);
  };

  const hideTooltip = () => {
    setTooltipShown(false);
    if (showTimeoutRef.current !== null) clearTimeout(showTimeoutRef.current);
  };

  return (
    <>
      <div
        className={`relative flex items-center border-2 border-gray dark:border-dark-gray [&.selected]:border-black [&.selected]:bg-black [&.selected]:bg-opacity-10 dark:[&.selected]:border-white dark:[&.selected]:bg-white dark:[&.selected]:bg-opacity-10 ${
          kanjiSelected ? 'selected' : ''
        }`}
      >
        <button
          tabIndex={focus ? undefined : -1}
          ref={cellButtonRef}
          className="flex-grow"
          onMouseEnter={() => {
            waitAndShowTooltip();
            setShowControls(true);
          }}
          onMouseLeave={() => {
            hideTooltip();
            setShowControls(false);
          }}
        >
          <KanjiCellContent kanji={kanji} detailedMode={detailedMode} />
        </button>

        <ProtectedContent
          placeholder={
            <ControlButton
              shown={focus || showControls || kanjiSaved}
              title={t('KanjiGrid.Tooltips.AuthRequired')}
              action={() => {
                cellButtonRef.current?.focus();
                showModal(<AuthModal />);
              }}
            >
              <SaveKanjiIcon />
            </ControlButton>
          }
        >
          <ControlButton
            shown={focus || showControls || kanjiSaved || loading}
            title={kanjiSaved ? t('KanjiGrid.Tooltips.Remove') : t('KanjiGrid.Tooltips.Save')}
            action={() => {
              cellButtonRef.current?.focus();
              saveKanji();
            }}
          >
            {loading ? <LoadingSpinner /> : kanjiSaved ? <KanjiSavedIcon /> : <SaveKanjiIcon />}
          </ControlButton>
        </ProtectedContent>
      </div>
      <Tooltip
        shown={tooltipShown}
        handleClose={() => setTooltipShown(false)}
        anchorRef={cellButtonRef}
      >
        <KanjiView
          kanji={kanji}
          viewContent={{ writing: true, meaning: true, onReadings: true, kunReadings: true }}
        />
      </Tooltip>
    </>
  );
};
export default KanjiCell;
