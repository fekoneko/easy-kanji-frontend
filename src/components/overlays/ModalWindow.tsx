import { ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import useOnClick from '../../hooks/useOnClick';
import useModal from '../../hooks/useModal';
import useOnKeyUp from '../../hooks/useOnKeyUp';

type ModalWindowProps = {
  shown?: boolean;
  children?: ReactNode;
};

const ModalWindow = ({ shown, children }: ModalWindowProps) => {
  const modalWindowBGRef = useRef<HTMLDivElement>(null);
  const modalWindowRef = useRef<HTMLDivElement>(null);
  const { closeModal } = useModal();

  useOnKeyUp('Escape', closeModal);

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
