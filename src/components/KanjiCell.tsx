import { useContext, useMemo, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';
import { isKanjiInList, changeKanjiInList } from '../controllers/kanjiController';
import ControlButton from './ControlButton';
import KanjiView from './KanjiView';
import Tooltip from './Tooltip';
import { ReactComponent as SaveKanjiIcon } from '../assets/saveKanji.svg';
import { ReactComponent as KanjiSavedIcon } from '../assets/kanjiSaved.svg';

type KanjiCellProps = {
  kanji: Kanji;
};

const KanjiCell = ({ kanji }: KanjiCellProps) => {
  const { selectedKanjis, setSelectedKanjis, savedKanjis, setSavedKanjis } =
    useContext(kanjiContext);
  const cellRef = useRef<HTMLDivElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [cellFocus, setCellFocus] = useState(false);
  const [cellHover, setCellHover] = useState(false);
  const kanjiSaved = useMemo(() => isKanjiInList(savedKanjis, kanji), [savedKanjis]);
  const kanjiSelected = useMemo(() => isKanjiInList(selectedKanjis, kanji), [selectedKanjis]);

  const waitAndShowTooltip = () => {
    const showTooltip = () => {
      if (!cellRef.current) return;
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
      <div ref={cellRef} className={`kanjiCell${kanjiSelected ? ' selected' : ''}`}>
        <button
          className="kanjiCellInner"
          onClick={() => changeKanjiInList(setSelectedKanjis, kanji)}
          onMouseEnter={() => {
            waitAndShowTooltip();
            setCellHover(true);
          }}
          onMouseLeave={() => {
            hideTooltip();
            setCellHover(false);
          }}
          onFocus={() => setCellFocus(true)}
          onBlur={() => setCellFocus(false)}
        >
          <p className="kanjiWriting">{kanji.writing}</p>
          <p className="kanjiMeaning">{kanji.meaning}</p>
        </button>
        <ControlButton
          shown={cellFocus || cellHover || kanjiSaved}
          title={kanjiSaved ? 'Удалить из сохранённых' : 'Сохранить кандзи'}
          action={() => changeKanjiInList(setSavedKanjis, kanji)}
        >
          {kanjiSaved ? <KanjiSavedIcon /> : <SaveKanjiIcon />}
        </ControlButton>
      </div>
      <Tooltip shown={tooltipShown} handleClose={() => setTooltipShown(false)} anchorRef={cellRef}>
        <KanjiView
          kanji={kanji}
          viewContent={{ writing: true, meaning: true, onReadings: true, kunReadings: true }}
        />
      </Tooltip>
    </>
  );
};
export default KanjiCell;
