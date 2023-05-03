import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import { isKanjiInList, changeKanjiInList } from '../../controllers/kanjiController';
import ControlButton from './ControlButton';
import KanjiView from './KanjiView';
import Tooltip from './Tooltip';
import { ReactComponent as SaveKanjiIcon } from '../../assets/saveKanji.svg';
import { ReactComponent as KanjiSavedIcon } from '../../assets/kanjiSaved.svg';
import useKeyPressed from '../../hooks/useKeyPressed';
import useOnClick from '../../hooks/useOnClick';
import usersApi from '../../api/usersApi';
import ProtectedContent from './ProtectedContent';
import useModal from '../../hooks/useModal';
import AuthModal from '../modals/AuthModal';

type KanjiCellProps = {
  kanji: Kanji;
  focus?: boolean;
  setFocus?: () => any;
  detailedMode?: boolean;
};

const KanjiCell = ({ kanji, focus, setFocus, detailedMode }: KanjiCellProps) => {
  const { selectedKanjis, setSelectedKanjis, savedKanjis, setSavedKanjis } =
    useContext(kanjiContext);
  const { showModal } = useModal();
  const cellButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  const showTimeoutRef = useRef<number | null>(null);
  const [showControls, setShowControls] = useState(false);
  const kanjiSaved = useMemo(() => isKanjiInList(savedKanjis, kanji), [savedKanjis]);
  const kanjiSelected = useMemo(() => isKanjiInList(selectedKanjis, kanji), [selectedKanjis]);
  const enterPressed = useKeyPressed('Enter');
  const spacePressed = useKeyPressed(' ');

  const selectKanji = () => changeKanjiInList(setSelectedKanjis, kanji);

  const saveKanji = async () => {
    if (kanjiSaved) {
      const removeSuccess = await usersApi.removeKanjisFromSaved([kanji.id]);
      if (!removeSuccess) return;
    } else {
      const saveSuccess = await usersApi.saveKanjis([kanji.id]);
      if (!saveSuccess) return;
    }
    changeKanjiInList(setSavedKanjis, kanji);
  };

  useOnClick(
    cellButtonRef,
    (e) => {
      selectKanji();
      if (setFocus) setFocus();
    },
    'inside'
  );

  useEffect(() => {
    if (focus) cellButtonRef.current?.focus();
    else cellButtonRef.current?.blur();
  }, [focus]);

  useEffect(() => {
    if (focus && enterPressed) {
      saveKanji();
    }
  }, [focus, enterPressed]);

  useEffect(() => {
    if (focus && spacePressed) {
      selectKanji();
    }
  }, [focus, spacePressed]);

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
      <div className={`kanjiCell${kanjiSelected ? ' selected' : ''}`}>
        <button
          tabIndex={focus ? undefined : -1}
          ref={cellButtonRef}
          className="kanjiCellButton"
          onMouseEnter={() => {
            waitAndShowTooltip();
            setShowControls(true);
          }}
          onMouseLeave={() => {
            hideTooltip();
            setShowControls(false);
          }}
        >
          <p className="kanjiWriting">{kanji.writing}</p>
          <div>
            <p className="kanjiMeaning">{kanji.meaning}</p>
            {detailedMode && (
              <>
                <p className="kanjiOnReadings">{kanji.onReadings.join('、')}</p>
                <p className="kanjiKunReadings">{kanji.kunReadings.join('、')}</p>
              </>
            )}
          </div>
        </button>
        <ProtectedContent
          allowedRoles={['Admin']}
          placeholder={
            <ControlButton
              shown={focus || showControls || kanjiSaved}
              title={'Войдите, чтобы сохранять кандзи'}
              action={() => {
                cellButtonRef.current?.focus();
                showModal(<AuthModal />);
              }}
            >
              {kanjiSaved ? <KanjiSavedIcon /> : <SaveKanjiIcon />}
            </ControlButton>
          }
        >
          <ControlButton
            shown={focus || showControls || kanjiSaved}
            title={kanjiSaved ? 'Удалить из сохранённых' : 'Сохранить кандзи'}
            action={() => {
              cellButtonRef.current?.focus();
              saveKanji();
            }}
          >
            {kanjiSaved ? <KanjiSavedIcon /> : <SaveKanjiIcon />}
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
