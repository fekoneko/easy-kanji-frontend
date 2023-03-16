import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiCard, { SideContent } from '../elements/KanjiCard';
import useKeyPressed from '../hooks/useKeyPressed';

type LearnUIProps = {
  frontSide: SideContent;
  backSide: SideContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { selectedKanjis } = useContext(kanjiContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const windowWidth = useWindowWidth();
  const arrowLeftPressed = useKeyPressed('ArrowLeft');
  const arrowRightPressed = useKeyPressed('ArrowRight');

  useEffect(() => {
    if (arrowLeftPressed && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    if (arrowRightPressed && currentIndex < selectedKanjis.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [arrowLeftPressed, arrowRightPressed]);

  return (
    <section className="learnUI">
      <div
        className="kanjiQueue"
        style={{
          transform: `translateX(calc(${
            -(windowWidth / 3) * currentIndex
          }px - var(--card-width) / 2))`,
        }}
      >
        {selectedKanjis.map((kanji, index) => (
          <KanjiCard
            key={index}
            kanji={kanji}
            frontSide={frontSide}
            backSide={backSide}
            shown={Math.abs(index - currentIndex) <= 1}
            positionOnScreen={
              index === currentIndex ? 'center' : index - currentIndex < 0 ? 'left' : 'right'
            }
            queueOrder={index}
          />
        ))}
      </div>
    </section>
  );
};
export default LearnUI;
