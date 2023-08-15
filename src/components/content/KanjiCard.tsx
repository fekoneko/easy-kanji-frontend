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
        className={`absolute flex aspect-[2/3] w-[--card-width] flex-col items-center transition-all ${
          positionOnScreen === 'center' ? 'z-20' : shown ? 'z-10 opacity-70' : 'z-0 opacity-0'
        }`}
        ref={cardContainerRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * cardIndex}px)`,
        }}
      >
        <button
          className={[
            'h-full w-full rounded-lg border-2 p-2 shadow-xl transition-all [&>*]:break-words [&>*]:rounded-lg [&>*]:border-2 [&>*]:border-dashed',
            side === 'front'
              ? '[&>*]:bg-soft-white dark:[&>*]:bg-softer-black'
              : '[&>*]:bg-white dark:[&>*]:bg-soft-black',
            positionOnScreen !== 'center' ? 'scale-75' : '',
            zoom ? 'scale-105' : '',
            cardRepeated ? 'bg-blue' : 'bg-white dark:bg-soft-black',
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
          <button
            ref={cardActionButtonRef}
            className="absolute -top-8 hover:underline"
            onClick={repeatCard}
          >
            {cardRepeated ? t('LearnUI.CardRepeated') : t('LearnUI.RepeatCard')}
          </button>
        </CSSTransition>
      </figure>
    </CSSTransition>
  );
};
export default KanjiCard;
