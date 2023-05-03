import { ReactNode, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnClick from '../../hooks/useOnClick';
import useKeyPressed from '../../hooks/useKeyPressed';
import useModal from '../../hooks/useModal';

type ModalWindowProps = {
  shown?: boolean;
  children?: ReactNode;
};

const ModalWindow = ({ shown, children }: ModalWindowProps) => {
  const modalWindowBGRef = useRef<HTMLDivElement>(null);
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const escapePressed = useKeyPressed('Escape');
  const { closeModal } = useModal();

  useEffect(() => {
    if (escapePressed) closeModal();
  }, [escapePressed]);

  useOnClick(
    modalWindowRef,
    () => {
      closeModal();
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
