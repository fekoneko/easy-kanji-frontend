import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import useKeyPressed from '../../hooks/useKeyPressed';
import KanjiCell from './KanjiCell';
import useResizeObserver from '../../hooks/useResizeObserver';
import KanjiChoiceCell from './KanjiChoiceCell';

const GRID_GAP = 8;
const COLUMNS_DEFAULT = 2;

type KanjiGridProps = {
  kanjis: Kanji[];
  maxCellWidth?: number;
  maxColumns?: number;
  kanjiChoiceMode?: boolean;
  chosenKanji?: Kanji | null;
  setChosenKanji?: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiGrid = ({
  kanjis,
  maxCellWidth,
  maxColumns,
  kanjiChoiceMode,
  chosenKanji,
  setChosenKanji,
}: KanjiGridProps) => {
  const arrowLeftPressed = useKeyPressed('ArrowLeft');
  const arrowRightPressed = useKeyPressed('ArrowRight');
  const arrowUpPressed = useKeyPressed('ArrowUp');
  const arrowDownPressed = useKeyPressed('ArrowDown');
  const shiftPressed = useKeyPressed('Shift');
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const gridRef = useRef<HTMLElement>(null);
  const size = useResizeObserver(gridRef);

  const columns =
    size && maxCellWidth
      ? Math.min(Math.floor(size.contentRect.width / maxCellWidth), maxColumns ?? 99999)
      : maxColumns ?? COLUMNS_DEFAULT;

  const moveFocus = (offset: number) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.nodeName))
      return;
    if (kanjis.length === -1) return;

    setFocusIndex((prev) => {
      if (prev === null) return 0;
      const newFocusIndex = prev + offset;
      const maxFocusIndex = kanjis.length - 1;

      if (newFocusIndex > maxFocusIndex) return maxFocusIndex;
      else if (newFocusIndex < 0) return 0;
      else return newFocusIndex;
    });
  };

  useEffect(() => {
    if (arrowLeftPressed) {
      const offset = shiftPressed ? -3 : -1;
      moveFocus(offset);
    }
  }, [arrowLeftPressed]);

  useEffect(() => {
    if (arrowRightPressed) {
      const offset = shiftPressed ? 3 : 1;
      moveFocus(offset);
    }
  }, [arrowRightPressed]);

  useEffect(() => {
    if (arrowUpPressed) {
      const offset = -(shiftPressed ? 3 : 1) * columns;
      moveFocus(offset);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      const offset = (shiftPressed ? 3 : 1) * columns;
      moveFocus(offset);
    }
  }, [arrowDownPressed]);

  return (
    <section
      ref={gridRef}
      className="kanjiGrid"
      style={{
        gridTemplateColumns: `repeat(${columns}, calc(${100 / columns}% - ${GRID_GAP / 2}px))`,
        gap: GRID_GAP,
      }}
    >
      {kanjis.map((kanji, index) =>
        kanjiChoiceMode ? (
          <KanjiChoiceCell
            key={index}
            kanji={kanji}
            focus={focusIndex === index}
            setFocus={() => setFocusIndex(index)}
            chosenKanji={chosenKanji}
            setChosenKanji={setChosenKanji}
          />
        ) : (
          <KanjiCell
            key={index}
            kanji={kanji}
            focus={focusIndex === index}
            setFocus={() => setFocusIndex(index)}
          />
        )
      )}
    </section>
  );
};
export default KanjiGrid;
