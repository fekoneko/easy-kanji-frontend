import { ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnClickOutside from '../hooks/useOnClickOutside';

type ModalWindowProps = {
  shown?: boolean;
  handleClose?: () => any;
  children?: ReactNode;
};

const ModalWindow = ({ shown, handleClose, children }: ModalWindowProps) => {
  const modalWindowBGRef = useRef<HTMLDivElement>(null);
  const modalWindowRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(modalWindowRef, () => {
    if (handleClose) handleClose();
  });

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
