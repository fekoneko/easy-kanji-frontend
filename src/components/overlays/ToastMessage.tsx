import { ReactNode, useRef } from 'react';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

type ToastMessageProps = {
  toastKey: number;
  shown?: boolean;
  children?: ReactNode;
};

const ToastMessage = ({ toastKey, shown, children }: ToastMessageProps) => {
  const toastMessageRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionGroup component={null}>
      <SwitchTransition mode={'out-in'}>
        <CSSTransition
          key={shown ? toastKey : -1}
          timeout={150}
          classNames="vertical-slide-transition"
          nodeRef={toastMessageRef}
        >
          {shown ? (
            <div
              ref={toastMessageRef}
              className="absolute bottom-4 z-[99001] flex w-screen justify-center"
            >
              <div className="max-w-[60vw] rounded-md border-[1.5px] bg-red bg-opacity-90 px-6 py-2 text-center text-white shadow-md">
                <p>{children}</p>
              </div>
            </div>
          ) : (
            <></>
          )}
        </CSSTransition>
      </SwitchTransition>
    </TransitionGroup>
  );
};
export default ToastMessage;
