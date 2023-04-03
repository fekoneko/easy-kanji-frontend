import { ReactNode, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnClick from '../hooks/useOnClick';
import useKeyPressed from '../hooks/useKeyPressed';

type ModalWindowProps = {
  shown?: boolean;
  handleClose?: () => any;
  children?: ReactNode;
};

const ModalWindow = ({ shown, handleClose, children }: ModalWindowProps) => {
  const modalWindowBGRef = useRef<HTMLDivElement>(null);
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const escapePressed = useKeyPressed('Escape');

  useEffect(() => {
    if (escapePressed && handleClose) handleClose();
  }, [escapePressed]);

  useOnClick(
    modalWindowRef,
    () => {
      if (handleClose) handleClose();
    },
    'outside'
  );

  return (
    <CSSTransition
      in={shown}
      unmountOnExit
      timeout={200}
      classNames="modalWindowTransition"
      nodeRef={modalWindowBGRef}
    >
      <div
        ref={modalWindowBGRef}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="modalWindowBG"
      >
        <div ref={modalWindowRef} className="modalWindow">
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};
export default ModalWindow;
