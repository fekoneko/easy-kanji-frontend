import { useContext, useRef, useState } from 'react';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';
import { isKanjiSelected, selectDeselectKanji } from '../controllers/kanjiController';
import KanjiView from './KanjiView';
import Tooltip from './Tooltip';

type KanjiCellProps = {
  kanji: Kanji;
};

const KanjiCell = ({ kanji }: KanjiCellProps) => {
  const { selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);
  const cellRef = useRef<HTMLButtonElement>(null);
  const [tooltipShown, setTooltipShown] = useState(false);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      <button
        ref={cellRef}
        className={`kanjiCell${isKanjiSelected(selectedKanjis, kanji) ? ' selected' : ''}`}
        onClick={() => selectDeselectKanji(selectedKanjis, setSelectedKanjis, kanji)}
        onMouseEnter={waitAndShowTooltip}
        onMouseLeave={hideTooltip}
      >
        <p className="kanjiWriting">{kanji.writing}</p>
        <p className="kanjiMeaning">{kanji.meaning}</p>
      </button>
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
