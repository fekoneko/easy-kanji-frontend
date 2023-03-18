import { ForwardedRef, ReactNode, useImperativeHandle, useRef } from 'react';

type ModalWindowProps = {
  shown?: boolean;
  handleClose?: () => any;
  children?: ReactNode;
};

const ModalWindow = ({ shown, handleClose, children }: ModalWindowProps) => {
  return (
    <>
      {shown ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (handleClose) handleClose();
          }}
          className="modalWindowBG"
        >
          <div onClick={(e) => e.stopPropagation()} className="modalWindow">
            {children}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default ModalWindow;
