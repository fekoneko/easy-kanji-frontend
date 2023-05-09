import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiCell from './KanjiCell';
import useResizeObserver from '../../hooks/useResizeObserver';
import KanjiChoiceCell from './KanjiChoiceCell';
import useOnKeyDown from '../../hooks/useOnKeyDown';

const GRID_GAP = 8;
const COLUMNS_DEFAULT = 2;

type KanjiGridProps = {
  kanjis: Kanji[];
  maxCellWidth?: number;
  maxColumns?: number;
  detailedMode?: boolean;
  kanjiChoiceMode?: boolean;
  chosenKanji?: Kanji | null;
  setChosenKanji?: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiGrid = ({
  kanjis,
  maxCellWidth,
  maxColumns,
  detailedMode,
  kanjiChoiceMode,
  chosenKanji,
  setChosenKanji,
}: KanjiGridProps) => {
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

  useOnKeyDown('ArrowLeft', () => moveFocus(-1), [], { shift: false });
  useOnKeyDown('ArrowLeft', () => moveFocus(-3), [], { shift: true });
  useOnKeyDown('ArrowRight', () => moveFocus(1), [], { shift: false });
  useOnKeyDown('ArrowRight', () => moveFocus(3), [], { shift: true });
  useOnKeyDown('ArrowUp', () => moveFocus(-columns), [], { shift: false });
  useOnKeyDown('ArrowUp', () => moveFocus(-3 * columns), [], { shift: true });
  useOnKeyDown('ArrowDown', () => moveFocus(columns), [], { shift: false });
  useOnKeyDown('ArrowDown', () => moveFocus(3 * columns), [], { shift: true });

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
            detailedMode={detailedMode}
            chosenKanji={chosenKanji}
            setChosenKanji={setChosenKanji}
          />
        ) : (
          <KanjiCell
            key={index}
            kanji={kanji}
            focus={focusIndex === index}
            setFocus={() => setFocusIndex(index)}
            detailedMode={detailedMode}
          />
        )
      )}
    </section>
  );
};
export default KanjiGrid;
