import { useWindowWidth } from '@react-hook/window-size';
import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnKeyUp from '../../hooks/useOnKeyUp';

type ActionCardProps = {
  shown: boolean;
  positionOnScreen: 'left' | 'center' | 'right';
  queueOrder: number;
  action: () => any;
  caption?: string;
};

const ActionCard = ({ shown, positionOnScreen, queueOrder, action, caption }: ActionCardProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
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
          className="actionCard"
          onClick={(e) => e.preventDefault()}
          onMouseDown={(e) => e.button === 0 && action()}
          tabIndex={-1}
        >
          <figcaption>{caption}</figcaption>
        </button>
      </figure>
    </CSSTransition>
  );
};
export default ActionCard;
