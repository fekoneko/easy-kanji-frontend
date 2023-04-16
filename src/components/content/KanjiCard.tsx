import { useWindowWidth } from '@react-hook/window-size';
import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Kanji } from '../../contexts/kanjiContext';
import useKeyPressed from '../../hooks/useKeyPressed';
import KanjiView, { ViewContent } from './KanjiView';

type Side = 'front' | 'back';

type KanjiCardProps = {
  kanji: Kanji;
  frontSide: ViewContent;
  backSide: ViewContent;
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

  const viewContent = side === 'front' ? frontSide : backSide;

  const turnCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));
  const zoomIn = () => setZoom(true);
  const zoomOut = () => setTimeout(() => setZoom(false), 50);

  useEffect(() => {
    if (spacePressed && positionOnScreen === 'center') {
      zoomIn();
      turnCard();
    } else {
      zoomOut();
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
              zoomIn();
              turnCard();
            }
          }}
          onMouseUp={(e) => e.button === 0 && zoomOut()}
          onMouseLeave={() => zoom && zoomOut()}
          onBlur={() => zoom && zoomOut()}
          tabIndex={-1}
        >
          <KanjiView kanji={kanji} viewContent={viewContent} />
        </button>
      </div>
    </CSSTransition>
  );
};
export default KanjiCard;
