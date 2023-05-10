import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import useKeyPressed from '../../hooks/useKeyPressed';
import KanjiView, { ViewContent } from './KanjiView';
import { changeKanjiInList, isKanjiInList } from '../../controllers/kanjiController';

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
  const { repeatKanjis, setRepeatKanjis } = useContext(kanjiContext);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<Side>('front');
  const windowWidth = useWindowWidth({ wait: 10 });
  const [zoom, setZoom] = useState<boolean>(false);
  const spacePressed = useKeyPressed(' ');
  const enterPressed = useKeyPressed('Enter');

  const cardRepeated = useMemo(() => isKanjiInList(repeatKanjis, kanji), [repeatKanjis, kanji]);
  const viewContent = side === 'front' ? frontSide : backSide;

  const flipCard = () => setSide((prev) => (prev === 'front' ? 'back' : 'front'));
  const repeatCard = () => changeKanjiInList(setRepeatKanjis, kanji);
  const zoomIn = () => setZoom(true);
  const zoomOut = () => setTimeout(() => setZoom(false), 50);

  useEffect(() => {
    if (spacePressed && positionOnScreen === 'center') {
      zoomIn();
      flipCard();
    } else {
      zoomOut();
    }
  }, [spacePressed, positionOnScreen]);

  useEffect(() => {
    if (enterPressed && positionOnScreen === 'center') {
      zoomIn();
      repeatCard();
    } else {
      zoomOut();
    }
  }, [enterPressed, positionOnScreen]);

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={300}
      classNames="cardContainer"
      nodeRef={nodeRef}
    >
      <figure
        className={`cardContainer  ${positionOnScreen}`}
        ref={nodeRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * queueOrder}px)`,
        }}
      >
        <button
          className={[
            'kanjiCard',
            side,
            ...(zoom ? ['zoom'] : []),
            ...(cardRepeated ? ['repeat'] : []),
          ].join(' ')}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            if (e.button === 0) {
              zoomIn();
              flipCard();
            }
          }}
          onMouseUp={(e) => e.button === 0 && zoomOut()}
          onMouseLeave={() => zoom && zoomOut()}
          onBlur={() => zoom && zoomOut()}
          tabIndex={-1}
        >
          <KanjiView kanji={kanji} viewContent={viewContent} />
        </button>
      </figure>
    </CSSTransition>
  );
};
export default KanjiCard;
