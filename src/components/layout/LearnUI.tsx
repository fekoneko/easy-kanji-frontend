import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import kanjisContext from '../../contexts/kanjisContext';
import KanjiCard from '../content/KanjiCard';
import { ViewContent } from '../content/KanjiView';
import { Link } from 'react-router-dom';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';
import KanjiCardNav from './KanjiCardNav';
import useOnKeyDown from '../../hooks/useOnKeyDown';
import ActionCard from '../content/ActionCard';
import { Trans, useTranslation } from 'react-i18next';
import ShowAtMedia from './ShowAtMedia';
import Loading from '../content/Loading';
import { compareKanjiLists } from '../../controllers/kanjiController';

type LearnUIProps = {
  frontSide: ViewContent;
  backSide: ViewContent;
};

const LearnUI = ({ frontSide, backSide }: LearnUIProps) => {
  const { t } = useTranslation();
  const {
    selectedKanjis,
    setSelectedKanjis,
    learnKanjis,
    setLearnKanjis,
    repeatKanjis,
    setRepeatKanjis,
    selectedLoadingStatus,
  } = useContext(kanjisContext);
  const learnUIRef = useRef<HTMLElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const windowWidth = useWindowWidth({ wait: 10 });
  const navCardCount = useMemo(() => Math.ceil(windowWidth / 50), [windowWidth]);

  useEffect(() => {
    if (!compareKanjiLists(learnKanjis, selectedKanjis)) setLearnKanjis(selectedKanjis);
  }, []);

  const maxIndex = learnKanjis.length - (repeatKanjis.length > 0 ? 0 : 1);

  useEffect(() => {
    if ((document.activeElement as any)?.blur) (document.activeElement as any).blur();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [learnKanjis]);

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

  return (
    <Loading status={selectedLoadingStatus}>
      {' '}
      {maxIndex >= 0 ? (
        <TransitionGroup component={null}>
          <SwitchTransition mode={'out-in'}>
            <CSSTransition
              key={learnKanjis.map((kanji) => kanji.id).join(' ')}
              timeout={150}
              classNames="vertical-slide-transition"
              nodeRef={learnUIRef}
            >
              <section
                ref={learnUIRef}
                className="relative flex flex-1 flex-col items-center justify-center"
              >
                <div
                  className="flex items-center transition-transform"
                  style={{
                    transform: `translateX(calc(${
                      -(windowWidth / 3) * currentIndex
                    }px - var(--card-width) / 2))`,
                  }}
                >
                  {learnKanjis.map(
                    (kanji, index) =>
                      Math.abs(index - currentIndex) <= 6 && (
                        <KanjiCard
                          key={kanji.id}
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
                          cardIndex={index}
                          handleFocus={() => setCurrentIndex(index)}
                        />
                      )
                  )}
                  {repeatKanjis.length > 0 && (
                    <ActionCard
                      key={-1}
                      shown={Math.abs(maxIndex - currentIndex) <= 1}
                      positionOnScreen={
                        maxIndex === currentIndex
                          ? 'center'
                          : maxIndex - currentIndex < 0
                          ? 'left'
                          : 'right'
                      }
                      cardIndex={maxIndex}
                      handleFocus={() => setCurrentIndex(maxIndex)}
                      action={selectRepeatKanjis}
                      caption={t('LearnUI.RepeatMarked')}
                    />
                  )}
                </div>

                <ShowAtMedia min="xs">
                  <KanjiCardNav
                    mode={frontSide.writing ? 'writing' : 'meaning'}
                    kanjis={learnKanjis}
                    currentIndex={currentIndex}
                    setCurrentIndex={setCurrentIndex}
                    maxNavCardCount={navCardCount}
                  />
                </ShowAtMedia>
              </section>
            </CSSTransition>
          </SwitchTransition>
        </TransitionGroup>
      ) : (
        <div className="content-placeholder">
          <Trans
            i18nKey="Pages.Learn.Placeholder"
            components={{ linkElement: <Link to="/popular" />, p: <p /> }}
          />
        </div>
      )}
    </Loading>
  );
};
export default LearnUI;
