import { useWindowWidth } from '@react-hook/window-size';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import useKeyPressed from '../../hooks/useKeyPressed';
import KanjiView, { ViewContent } from './KanjiView';
import { changeKanjiInList, isKanjiInList } from '../../controllers/kanjiController';
import { useTranslation } from 'react-i18next';

type Side = 'front' | 'back';

type KanjiCardProps = {
  kanji: Kanji;
  frontSide: ViewContent;
  backSide: ViewContent;
  shown: boolean;
  positionOnScreen: 'left' | 'center' | 'right';
  cardIndex: number;
  handleFocus?: () => any;
};

const KanjiCard = ({
  kanji,
  frontSide,
  backSide,
  shown,
  positionOnScreen,
  cardIndex,
  handleFocus,
}: KanjiCardProps) => {
  const { t } = useTranslation();
  const { repeatKanjis, setRepeatKanjis } = useContext(kanjiContext);
  const cardContainerRef = useRef<HTMLElement>(null);
  const cardActionButtonRef = useRef<HTMLButtonElement>(null);
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
      nodeRef={cardContainerRef}
    >
      <figure
        className={`cardContainer  ${positionOnScreen}`}
        ref={cardContainerRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * cardIndex}px)`,
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
              if (positionOnScreen === 'center') {
                zoomIn();
                flipCard();
              } else if (handleFocus) handleFocus();
            }
          }}
          onMouseUp={(e) => e.button === 0 && zoomOut()}
          onMouseLeave={() => zoom && zoomOut()}
          onBlur={() => zoom && zoomOut()}
          tabIndex={-1}
        >
          <KanjiView kanji={kanji} viewContent={viewContent} />
        </button>

        <CSSTransition
          in={positionOnScreen === 'center' && side === 'back'}
          unmountOnExit
          timeout={300}
          classNames="fade"
          nodeRef={cardActionButtonRef}
        >
          <button ref={cardActionButtonRef} className="cardActionButton" onClick={repeatCard}>
            {cardRepeated ? t('LearnUI.CardRepeated') : t('LearnUI.RepeatCard')}
          </button>
        </CSSTransition>
      </figure>
    </CSSTransition>
  );
};
export default KanjiCard;
