import { useWindowWidth } from '@react-hook/window-size';
import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnKeyUp from '../../hooks/useOnKeyUp';

type ActionCardProps = {
  shown: boolean;
  positionOnScreen: 'left' | 'center' | 'right';
  cardIndex: number;
  handleFocus?: () => any;
  action: () => any;
  caption?: string;
};

const ActionCard = ({
  shown,
  positionOnScreen,
  cardIndex,
  handleFocus,
  action,
  caption,
}: ActionCardProps) => {
  const cardContainerRef = useRef<HTMLElement>(null);
  const windowWidth = useWindowWidth({ wait: 10 });

  const handleKeyUp = () => {
    if (positionOnScreen !== 'center') return;
    setTimeout(action, 10);
  };

  useOnKeyUp('Enter', handleKeyUp);
  useOnKeyUp(' ', handleKeyUp);

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={300}
      classNames="cardContainer"
      nodeRef={cardContainerRef}
    >
      <figure
        className={`absolute flex aspect-[2/3] w-[--card-width] flex-col items-center ${
          positionOnScreen === 'center' ? 'z-10' : ''
        }`}
        ref={cardContainerRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * cardIndex}px)`,
        }}
      >
        <button
          className={`h-full w-full rounded-lg border-2 p-2 shadow-md transition-all ${
            positionOnScreen !== 'center' ? 'scale-75' : ''
          }`}
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => {
            if (e.button === 0) {
              action();

              if (positionOnScreen !== 'center' && handleFocus) {
                handleFocus();
              }
            }
          }}
          tabIndex={-1}
        >
          <figcaption>{caption}</figcaption>
        </button>
      </figure>
    </CSSTransition>
  );
};
export default ActionCard;
