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
            <div ref={popupMessageRef} className="popupMessage">
              <p>{children}</p>
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
