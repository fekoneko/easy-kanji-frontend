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
        className="absolute left-0 top-0 z-[99000] flex h-screen w-screen items-center justify-center bg-black bg-opacity-40"
      >
        <div
          ref={modalWindowRef}
          className="min-w-[48vw] rounded-sm border-2 border-blue bg-white p-4 shadow-md shadow-black dark:bg-soft-black dark:text-soft-white sm:min-w-[300px]"
        >
          {children}
        </div>
      </div>
    </CSSTransition>
  );
};
export default ModalWindow;
