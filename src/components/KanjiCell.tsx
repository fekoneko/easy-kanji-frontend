import { MouseEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';
import { isKanjiInList, changeKanjiInList } from '../controllers/kanjiController';
import ControlButton from './ControlButton';
import KanjiView from './KanjiView';
import Tooltip from './Tooltip';
import { ReactComponent as SaveKanjiIcon } from '../assets/saveKanji.svg';
import { ReactComponent as KanjiSavedIcon } from '../assets/kanjiSaved.svg';
import useKeyPressed from '../hooks/useKeyPressed';
import useOnClick from '../hooks/useOnClick';

type KanjiCellProps = {
  kanji: Kanji;
  focus?: boolean;
  setFocus?: () => any;
};

const KanjiCell = ({ kanji, focus, setFocus }: KanjiCellProps) => {
  const { selectedKanjis, setSelectedKanjis, savedKanjis, setSavedKanjis } =
    useContext(kanjiContext);
  const cellButtonRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showControls, setShowControls] = useState(false);
  const kanjiSaved = useMemo(() => isKanjiInList(savedKanjis, kanji), [savedKanjis]);
  const kanjiSelected = useMemo(() => isKanjiInList(selectedKanjis, kanji), [selectedKanjis]);
  const enterPressed = useKeyPressed('Enter');
  const spacePressed = useKeyPressed(' ');

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

  const selectKanji = () => changeKanjiInList(setSelectedKanjis, kanji);
  const saveKanji = () => changeKanjiInList(setSavedKanjis, kanji);

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
          <p className="kanjiMeaning">{kanji.meaning}</p>
        </button>
        <ControlButton
          shown={focus || showControls || kanjiSaved}
          title={kanjiSaved ? 'Удалить из сохранённых' : 'Сохранить кандзи'}
          action={(e) => {
            cellButtonRef.current?.focus();
            saveKanji();
          }}
        >
          {kanjiSaved ? <KanjiSavedIcon /> : <SaveKanjiIcon />}
        </ControlButton>
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
