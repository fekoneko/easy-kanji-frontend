import { ReactNode, useRef } from 'react';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

type PopupMessageProps = {
  popupKey: number;
  shown?: boolean;
  children?: ReactNode;
};

const PopupMessage = ({ popupKey, shown, children }: PopupMessageProps) => {
  const popupMessageRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionGroup component={null}>
      <SwitchTransition mode={'out-in'}>
        <CSSTransition
          key={shown ? popupKey : -1}
          timeout={150}
          classNames="popupMessage"
          nodeRef={popupMessageRef}
        >
          {shown ? (
            <div
              ref={popupMessageRef}
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
export default PopupMessage;
