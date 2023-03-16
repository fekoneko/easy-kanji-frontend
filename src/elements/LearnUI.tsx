import { useContext, useEffect, useState } from 'react';
import globalContext from '../contexts/globalContext';
import kanjiContext from '../contexts/kanjiContext';
import KanjiCard, { SideContent } from '../elements/KanjiCard';

export type Direction = 'left' | 'right' | null;

type LearnUIProps = {
  frontSide: SideContent;
  backSide: SideContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { lastPressedKey } = useContext(globalContext);
  const { selectedKanjis } = useContext(kanjiContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [animationDirection, setAnimationDirection] = useState<Direction>(null);

  useEffect(() => {
    if (animationDirection) return;
    if (lastPressedKey === 'ArrowLeft' && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setAnimationDirection('left');
    }
    if (lastPressedKey === 'ArrowRight' && currentIndex < selectedKanjis.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnimationDirection('right');
    }
  }, [lastPressedKey]);

  return (
    <section className="learnUI">
      {selectedKanjis.map((kanji, index) => (
        <KanjiCard
          key={index}
          kanji={kanji}
          frontSide={frontSide}
          backSide={backSide}
          shown={index === currentIndex}
          onExit={() => setAnimationDirection(null)}
          animationDirection={animationDirection}
          main={currentIndex === index}
        />
      ))}
    </section>
  );
};
export default LearnUI;
