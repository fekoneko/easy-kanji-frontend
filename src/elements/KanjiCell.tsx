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
  const [tooltipPositionWhenDown, setTooltipPositionWhenDown] = useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });
  const [tooltipPositionWhenUp, setTooltipPositionWhenUp] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [tooltipWidth, setTooltipWidth] = useState<number>(100);

  const showTooltip = () => {
    setTooltipShown(true);
    if (cellRef.current) {
      const cellRect = cellRef.current.getBoundingClientRect();
      setTooltipPositionWhenDown({
        x: cellRect.left + cellRect.width! / 2,
        y: cellRect.bottom,
      });
      setTooltipPositionWhenUp({
        x: cellRect.left + cellRect.width! / 2,
        y: cellRect.top,
      });
      if (cellRect.width > 10) setTooltipWidth(cellRect.width - 10);
    }
  };

  const hideTooltip = () => {
    setTooltipShown(false);
  };

  return (
    <>
      <button
        ref={cellRef}
        className={`kanjiCell${isKanjiSelected(selectedKanjis, kanji) ? ' selected' : ''}`}
        onClick={() => selectDeselectKanji(selectedKanjis, setSelectedKanjis, kanji)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        <p className="kanjiWriting">{kanji.writing}</p>
        <p className="kanjiMeaning">{kanji.meaning}</p>
      </button>
      <Tooltip
        shown={tooltipShown}
        handleClose={() => setTooltipShown(false)}
        positionWhenDown={tooltipPositionWhenDown}
        positionWhenUp={tooltipPositionWhenUp}
        width={tooltipWidth}
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
