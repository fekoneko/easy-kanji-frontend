import { useEffect, useState } from 'react';
import { Kanji } from '../contexts/kanjiContext';
import useKeyPressed from '../hooks/useKeyPressed';
import KanjiCell from './KanjiCell';

const COLUMNS_COUNT = 2;

type KanjiGridProps = {
  kanjis: Kanji[];
};

const KanjiGrid = ({ kanjis }: KanjiGridProps) => {
  const arrowLeftPressed = useKeyPressed('ArrowLeft');
  const arrowRightPressed = useKeyPressed('ArrowRight');
  const arrowUpPressed = useKeyPressed('ArrowUp');
  const arrowDownPressed = useKeyPressed('ArrowDown');
  const shiftPressed = useKeyPressed('Shift');
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  const moveFocus = (offset: number) => {
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
      const offset = -(shiftPressed ? 3 : 1) * COLUMNS_COUNT;
      moveFocus(offset);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      const offset = (shiftPressed ? 3 : 1) * COLUMNS_COUNT;
      moveFocus(offset);
    }
  }, [arrowDownPressed]);

  return (
    <section className="kanjiGrid">
      {kanjis.map((kanji, index) => (
        <KanjiCell
          key={index}
          kanji={kanji}
          focus={focusIndex === index}
          setFocus={() => setFocusIndex(index)}
        />
      ))}
    </section>
  );
};
export default KanjiGrid;
