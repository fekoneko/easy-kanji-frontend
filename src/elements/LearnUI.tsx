import { useContext, useEffect, useRef, useState } from 'react';
import globalContext from '../contexts/globalContext';
import kanjiContext from '../contexts/kanjiContext';
import KanjiCard, { SideContent } from '../elements/KanjiCard';

export type Direction = 'left' | 'right';

type LearnUIProps = {
  frontSide: SideContent;
  backSide: SideContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { lastPressedKey } = useContext(globalContext);
  const { selectedKanjis } = useContext(kanjiContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [animationDirection, setAnimationDirection] = useState<Direction>('right');
  const allowMove = useRef<boolean>(true);

  useEffect(() => {
    if (!allowMove.current) return;
    if (lastPressedKey === 'ArrowLeft' && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setAnimationDirection('left');
    }
    if (lastPressedKey === 'ArrowRight' && currentIndex < selectedKanjis.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnimationDirection('right');
    }
  }, [lastPressedKey]);

  useEffect(() => {
    allowMove.current = false;
    const timeoutId = setTimeout(() => (allowMove.current = true), 300);
    return () => clearTimeout(timeoutId);
  }, [currentIndex]);

  return (
    <section className="learnUI">
      {selectedKanjis.map((kanji, index) => (
        <KanjiCard
          key={index}
          kanji={kanji}
          frontSide={frontSide}
          backSide={backSide}
          shown={Math.abs(index - currentIndex) <= 1}
          position={
            index - currentIndex === 0 ? 'center' : index - currentIndex < 0 ? 'left' : 'right'
          }
          animationDirection={animationDirection}
          main={currentIndex === index}
        />
      ))}
    </section>
  );
};
export default LearnUI;
