import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import globalContext from '../contexts/globalContext';
import { Kanji } from '../contexts/kanjiContext';
import { Direction } from '../elements/LearnUI';

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
  position: 'left' | 'center' | 'right';
  animationDirection: Direction;
  main: boolean;
};

const KanjiCard = ({
  kanji,
  frontSide,
  backSide,
  shown,
  position,
  animationDirection,
  main,
}: KanjiCardProps) => {
  const { lastPressedKey } = useContext(globalContext);
  const nodeRef = useRef(null);
  const [side, setSide] = useState<Side>('front');
  const [entered, setEntered] = useState<boolean>(true);
  const sideContent = side === 'front' ? frontSide : backSide;

  const turnCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));

  useEffect(() => {
    if (lastPressedKey === ' ' && main) {
      turnCard();
    }
  }, [lastPressedKey]);

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={300}
      classNames="kanjiCard"
      nodeRef={nodeRef}
      onEnter={() => setEntered(false)}
      onEntered={() => setEntered(true)}
      onExit={() => setEntered(false)}
    >
      <button
        ref={nodeRef}
        className={`kanjiCard${side === 'front' ? ' frontSide ' : ' backSide '}${
          animationDirection !== null ? animationDirection : ''
        }`}
        onClick={turnCard}
        style={{
          ...(position === 'left'
            ? { transform: 'translateX(-30vw) scale(0.85)' }
            : position === 'right'
            ? { transform: 'translateX(30vw) scale(0.85)' }
            : {}),
          ...(entered ? { transition: 'var(--kanji-card-transition)' } : {}),
        }}
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
