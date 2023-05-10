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
        className={`cardContainer  ${positionOnScreen}`}
        ref={cardContainerRef}
        style={{
          transform: `translateX(${(windowWidth / 3) * cardIndex}px)`,
        }}
      >
        <button
          className="actionCard"
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
