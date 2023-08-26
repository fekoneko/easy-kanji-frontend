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
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../animations/LoadingSpinner';
import authContext from '../../contexts/authContext';
import useOnKeyUp from '../../hooks/useOnKeyUp';
import { useTranslation } from 'react-i18next';
import KanjiCellContent from './KanjiCellContent';
import useLoading from '../../hooks/useLoading';

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
  const [trackKanjiSaving, kanjiSavingStatus] = useLoading();
  const [trackKanjiRemoval, kanjiRemovalStatus] = useLoading();
  const { showToast } = useToast();

  const selectDeselectKanji = () => changeKanjiInList(setSelectedKanjis, kanji);

  const saveRemoveKanji = () => {
    if (kanjiSavingStatus === 'pending' || kanjiRemovalStatus === 'pending' || !auth) return;

    if (kanjiSaved) {
      trackKanjiRemoval(
        () => usersApi.removeKanjisFromSaved([kanji.id], abortControllerRef.current.signal),
        () => changeKanjiInList(setSavedKanjis, kanji),
        () => showToast(t('KanjiGrid.Errors.SaveFailed'))
      );
    } else {
      trackKanjiSaving(
        () => usersApi.saveKanjis([kanji.id], abortControllerRef.current.signal),
        () => changeKanjiInList(setSavedKanjis, kanji),
        () => showToast(t('KanjiGrid.Errors.RemoveFailed'))
      );
    }
  };

  useOnClick(
    cellButtonRef,
    () => {
      selectDeselectKanji();
      if (setFocus) setFocus();
    },
    'inside'
  );

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  useOnKeyUp('Enter', () => focus && saveRemoveKanji(), [focus]);
  useOnKeyUp(' ', () => focus && selectDeselectKanji(), [focus]);

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
        className={`relative flex items-center rounded-sm border-2 border-gray dark:border-dark-gray [&.selected]:border-black [&.selected]:bg-black [&.selected]:bg-opacity-10 dark:[&.selected]:border-white dark:[&.selected]:bg-white dark:[&.selected]:bg-opacity-10 [&:has(button:focus)]:border-blue dark:[&:has(button:focus)]:border-blue ${
          kanjiSelected ? 'selected' : ''
        }`}
      >
        <button
          tabIndex={focus ? undefined : -1}
          ref={cellButtonRef}
          className="flex-grow px-1 focus:outline-none"
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
            shown={
              focus ||
              showControls ||
              kanjiSaved ||
              kanjiSavingStatus === 'pending' ||
              kanjiRemovalStatus === 'pending'
            }
            title={kanjiSaved ? t('KanjiGrid.Tooltips.Remove') : t('KanjiGrid.Tooltips.Save')}
            action={() => {
              cellButtonRef.current?.focus();
              saveRemoveKanji();
            }}
          >
            {kanjiSavingStatus === 'pending' || kanjiRemovalStatus === 'pending' ? (
              <LoadingSpinner small />
            ) : kanjiSaved ? (
              <KanjiSavedIcon />
            ) : (
              <SaveKanjiIcon />
            )}
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
