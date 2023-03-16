import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import globalContext from '../contexts/globalContext';
import { Kanji } from '../contexts/kanjiContext';

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
  positionOnScreen: 'left' | 'center' | 'right';
  queueOrder: number;
};

const KanjiCard = ({
  kanji,
  frontSide,
  backSide,
  shown,
  positionOnScreen,
  queueOrder,
}: KanjiCardProps) => {
  const { lastPressedKey } = useContext(globalContext);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<Side>('front');
  const sideContent = side === 'front' ? frontSide : backSide;
  const windowWidth = useWindowWidth();

  const turnCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));

  useEffect(() => {
    if (lastPressedKey === ' ' && positionOnScreen === 'center') {
      turnCard();
    }
  }, [lastPressedKey]);

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={300}
      classNames="kanjiCardContainer"
      nodeRef={nodeRef}
    >
      <div
        className={`kanjiCardContainer  ${positionOnScreen}`}
        ref={nodeRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * queueOrder}px)`,
        }}
      >
        <button className={`kanjiCard ${side}`} onClick={turnCard}>
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
      </div>
    </CSSTransition>
  );
};
export default KanjiCard;
