import { ReactNode, RefObject, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

type AnimatedRouteProps = {
  absolutePath: string;
  element: ReactNode;
  mainRef?: RefObject<HTMLElement>;
};

const AnimatedRoute = ({ absolutePath, mainRef, element }: AnimatedRouteProps) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={location.pathname === absolutePath}
      unmountOnExit
      timeout={200}
      classNames="animatedRoute"
      nodeRef={nodeRef}
    >
      <div
        className="animatedRoute"
        style={mainRef?.current ? { height: mainRef.current.offsetHeight } : {}}
        ref={nodeRef}
      >
        {element}
      </div>
    </CSSTransition>
  );
};
export default AnimatedRoute;
