import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Kanji } from '../contexts/kanjiContext';
import useKeyPressed from '../hooks/useKeyPressed';

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
  const nodeRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<Side>('front');
  const windowWidth = useWindowWidth({ wait: 10 });
  const [zoom, setZoom] = useState<boolean>(false);
  const spacePressed = useKeyPressed(' ');

  const sideContent = side === 'front' ? frontSide : backSide;

  const turnCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));

  useEffect(() => {
    if (spacePressed && positionOnScreen === 'center') {
      setZoom(true);
      turnCard();
    } else {
      setZoom(false);
    }
  }, [spacePressed]);

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
        <button
          className={`kanjiCard ${side} ${zoom ? ' zoom' : ''}`}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            if (e.button === 0) {
              setZoom(true);
              turnCard();
            }
          }}
          onMouseUp={(e) => e.button === 0 && setZoom(false)}
          onMouseLeave={() => zoom && setZoom(false)}
          onBlur={() => zoom && setZoom(false)}
          tabIndex={-1}
        >
          <div className="kanjiCardInner">
            {sideContent.writing && <p className="kanjiWriting">{kanji.writing}</p>}
            {sideContent.meaning && (
              <p className={`kanjiMeaning${!sideContent.writing ? ' main' : ''}`}>
                {kanji.meaning}
              </p>
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
          </div>
        </button>
      </div>
    </CSSTransition>
  );
};
export default KanjiCard;
