import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import globalContext from '../contexts/globalContext';
import { Kanji } from '../contexts/kanjiContext';
import { Direction } from '../pages/LearnByMeaningPage';

type Side = 'front' | 'back';

export type SideContent = {
  writing: boolean;
  meaning: boolean;
  onReadings: boolean;
  kunReadings: boolean;
};

type KanjiCardProps = {
  kanji: Kanji;
  frontSide: SideContent;
  backSide: SideContent;
  shown: boolean;
  onExit: () => any;
  animationDirection: Direction;
  main: boolean;
};

const KanjiCard = ({
  kanji,
  frontSide,
  backSide,
  shown,
  onExit,
  animationDirection,
  main,
}: KanjiCardProps) => {
  const { lastPressedKey } = useContext(globalContext);
  const nodeRef = useRef(null);
  const [side, setSide] = useState<Side>('front');
  const sideContent = side === 'front' ? frontSide : backSide;

  const turnCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));

  useEffect(() => {
    if (animationDirection) return;
    if (lastPressedKey === ' ' && main) {
      turnCard();
    }
  }, [lastPressedKey]);

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={150}
      classNames="kanjiCard"
      nodeRef={nodeRef}
      onExited={onExit}
    >
      <button
        ref={nodeRef}
        className={`kanjiCard${side === 'front' ? ' frontSide ' : ' backSide '}${
          animationDirection !== null ? animationDirection : ''
        }`}
        onClick={turnCard}
      >
        {sideContent.writing && <p className="kanjiWriting">{kanji.writing}</p>}
        {sideContent.meaning && (
          <p className={`kanjiMeaning${!sideContent.writing ? ' main' : ''}`}>{kanji.meaning}</p>
        )}
        {sideContent.onReadings && (
          <p className="kanjiOnReadings">
            {kanji.onReadings.map((reading, index) => (
              <span key={index}>
                {reading}
                {index < kanji.onReadings.length - 1 && '、'}
              </span>
            ))}
          </p>
        )}
        {sideContent.kunReadings && (
          <p className="kanjiKunReadings">
            {kanji.kunReadings.map((reading, index) => (
              <span key={index}>
                {reading}
                {index < kanji.kunReadings.length - 1 && '、'}
              </span>
            ))}
          </p>
        )}
      </button>
    </CSSTransition>
  );
};
export default KanjiCard;
