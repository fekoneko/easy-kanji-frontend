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
import ActionCard from '../content/ActionCard';

type LearnUIProps = {
  frontSide: ViewContent;
  backSide: ViewContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { selectedKanjis, setSelectedKanjis, repeatKanjis, setRepeatKanjis } =
    useContext(kanjiContext);
  const [pageKanjis] = usePageKanjis(selectedKanjis);
  const learnUIRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const windowWidth = useWindowWidth({ wait: 10 });

  const maxIndex = pageKanjis.length - (repeatKanjis.length > 0 ? 0 : 1);

  useEffect(() => {
    if ((document.activeElement as any)?.blur) (document.activeElement as any).blur();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [pageKanjis]);

  useOnKeyDown('ArrowLeft', () => currentIndex > 0 && setCurrentIndex((prev) => prev - 1), [
    currentIndex,
  ]);

  useOnKeyDown('ArrowRight', () => currentIndex < maxIndex && setCurrentIndex((prev) => prev + 1), [
    currentIndex,
    maxIndex,
  ]);

  const selectRepeatKanjis = () => {
    setSelectedKanjis(repeatKanjis);
    setRepeatKanjis([]);
  };

  if (maxIndex >= 0) {
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
                {repeatKanjis.length > 0 && (
                  <ActionCard
                    key={maxIndex}
                    shown={Math.abs(maxIndex - currentIndex) <= 1}
                    positionOnScreen={
                      maxIndex === currentIndex
                        ? 'center'
                        : maxIndex - currentIndex < 0
                        ? 'left'
                        : 'right'
                    }
                    queueOrder={maxIndex}
                    action={selectRepeatKanjis}
                    caption="Повторить помеченные кандзи"
                  />
                )}
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
