import { MouseEvent, ReactNode, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

type ControlButtonProps = {
  shown?: boolean;
  disabled?: boolean;
  title?: string;
  action?: (e: MouseEvent) => any;
  children?: ReactNode;
};

const ControlButton = ({ shown, disabled, title, action, children }: ControlButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [buttonHover, setButtonHover] = useState(false);

  return (
    <CSSTransition
      in={shown || buttonHover}
      unmountOnExit
      timeout={200}
      classNames="fade"
      nodeRef={buttonRef}
    >
      <button
        tabIndex={-1}
        ref={buttonRef}
        title={title}
        disabled={disabled}
        className="controlButton"
        onClick={(e) => !disabled && action && action(e)}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        {children}
      </button>
    </CSSTransition>
  );
};
export default ControlButton;
