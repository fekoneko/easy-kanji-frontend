import { RefObject, useContext, useEffect, useState } from 'react';
import { Kanji } from '../contexts/kanjiContext';
import useKeyPressed from '../hooks/useKeyPressed';
import KanjiCell from './KanjiCell';
import globalContext from '../contexts/globalContext';

const COLUMNS_COUNT = 2;

type KanjiGridProps = {
  kanjis: Kanji[];
};

const KanjiGrid = ({ kanjis }: KanjiGridProps) => {
  const { inSectionPath } = useContext(globalContext);
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

  if (kanjis.length > 0)
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
  else
    return (
      <div className="errorMessage">
        {inSectionPath === 'popular' ? (
          <h2 className="errorTip">Пустой список</h2>
        ) : inSectionPath === 'saved' ? (
          <p className="errorTip">
            Вы пока не сохранили ни одного Кандзи <br />
            Перейдите в раздел <a href="http://localhost:5173/popular">Популярные</a>
          </p>
        ) : inSectionPath === 'search' ? (
          <p className="errorTip">Здесь пока что пусто</p>
        ) : inSectionPath === 'selected' ? (
          <p className="errorTip">
            Вы пока выбрали ни одного Кандзи <br />
            Перейдите в раздел <a href="http://localhost:5173/popular">Популярные</a>
          </p>
        ) : null}
      </div>
    );
};
export default KanjiGrid;
