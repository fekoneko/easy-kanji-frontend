import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiCell from './KanjiCell';
import useResizeObserver from '../../hooks/useResizeObserver';
import KanjiChoiceCell from './KanjiChoiceCell';
import useOnKeyDown from '../../hooks/useOnKeyDown';
import DisplayInViewport from '../layout/DisplayInViewport';

const COLUMNS_DEFAULT = 2;
const CHUNK_ROWS = 50;

const splitIntoChunks = <T,>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

type KanjiGridProps = {
  kanjis: Kanji[];
  minCellWidth?: number;
  maxColumns?: number;
  detailedMode?: boolean;
  kanjiChoiceMode?: boolean;
  chosenKanji?: Kanji | null;
  setChosenKanji?: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiGrid = ({
  kanjis,
  minCellWidth,
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
    minCellWidth !== undefined
      ? Math.min(
          Math.max(Math.floor((size?.contentRect.width ?? window.innerWidth) / minCellWidth), 1),
          maxColumns ?? 99999
        )
      : maxColumns ?? COLUMNS_DEFAULT;

  const moveFocus = (offset: number) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.nodeName))
      return;

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
    <section ref={gridRef} className="grid grid-cols-1 gap-2">
      {splitIntoChunks(kanjis, CHUNK_ROWS * columns).map((kanjiChunk, chunkIndex) => (
        <DisplayInViewport
          key={chunkIndex}
          className="grid gap-2"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {kanjiChunk.map((kanji, kanjiIndex) =>
            kanjiChoiceMode ? (
              <KanjiChoiceCell
                key={kanjiIndex}
                kanji={kanji}
                focus={focusIndex === chunkIndex + kanjiIndex}
                setFocus={() => setFocusIndex(chunkIndex + kanjiIndex)}
                detailedMode={detailedMode}
                chosenKanji={chosenKanji}
                setChosenKanji={setChosenKanji}
              />
            ) : (
              <KanjiCell
                key={kanjiIndex}
                kanji={kanji}
                focus={focusIndex === chunkIndex + kanjiIndex}
                setFocus={() => setFocusIndex(chunkIndex + kanjiIndex)}
                detailedMode={detailedMode}
              />
            )
          )}
        </DisplayInViewport>
      ))}
    </section>
  );
};
export default KanjiGrid;
