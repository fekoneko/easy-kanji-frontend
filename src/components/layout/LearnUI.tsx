import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useRef, useState } from 'react';
import kanjiContext from '../../contexts/kanjiContext';
import KanjiCard from '../content/KanjiCard';
import { ViewContent } from '../content/KanjiView';
import { Link } from 'react-router-dom';
import usePageKanjis from '../../hooks/usePageKanjis';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';
import KanjiCardNav from './KanjiCardNav';
import useOnKeyDown from '../../hooks/useOnKeyDown';

type LearnUIProps = {
  frontSide: ViewContent;
  backSide: ViewContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { selectedKanjis } = useContext(kanjiContext);
  const [pageKanjis] = usePageKanjis(selectedKanjis);
  const learnUIRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const windowWidth = useWindowWidth({ wait: 10 });

  useOnKeyDown('ArrowLeft', () => currentIndex > 0 && setCurrentIndex((prev) => prev - 1), [
    currentIndex,
  ]);

  useOnKeyDown(
    'ArrowRight',
    () => currentIndex < pageKanjis.length - 1 && setCurrentIndex((prev) => prev + 1),
    [currentIndex, pageKanjis.length]
  );

  if (pageKanjis.length !== 0) {
    return (
      <TransitionGroup component={null}>
        <SwitchTransition mode={'out-in'}>
          <CSSTransition
            key={pageKanjis.map((kanji) => kanji.id).join(' ')}
            timeout={150}
            classNames="learnUI"
            nodeRef={learnUIRef}
          >
            <section ref={learnUIRef} className="learnUI">
              <div
                className="kanjiQueue"
                style={{
                  transform: `translateX(calc(${
                    -(windowWidth / 3) * currentIndex
                  }px - var(--card-width) / 2))`,
                }}
              >
                {pageKanjis.map((kanji, index) => (
                  <KanjiCard
                    key={index}
                    kanji={kanji}
                    frontSide={frontSide}
                    backSide={backSide}
                    shown={Math.abs(index - currentIndex) <= 1}
                    positionOnScreen={
                      index === currentIndex
                        ? 'center'
                        : index - currentIndex < 0
                        ? 'left'
                        : 'right'
                    }
                    queueOrder={index}
                  />
                ))}
              </div>
              <KanjiCardNav
                mode={frontSide.writing ? 'writing' : 'meaning'}
                kanjis={pageKanjis}
                setCurrentIndex={setCurrentIndex}
              />
            </section>
          </CSSTransition>
        </SwitchTransition>
      </TransitionGroup>
    );
  } else
    return (
      <div className="contentPlaceholder">
        <p>Выберите кандзи для обучения</p>
        <p>
          Перейти в раздел <Link to="/popular">Популярные</Link>
        </p>
      </div>
    );
};
export default LearnUI;
