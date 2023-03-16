import { ReactNode, useContext, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import globalContext from '../contexts/globalContext';

type AnimatedRouteProps = {
  absolutePath: string;
  element: ReactNode;
};

const AnimatedRoute = ({ absolutePath, element }: AnimatedRouteProps) => {
  const { location } = useContext(globalContext);
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <CSSTransition
      in={location.pathname === absolutePath}
      unmountOnExit
      timeout={200}
      classNames="animatedRoute"
      nodeRef={nodeRef}
    >
      <div ref={nodeRef}>{element}</div>
    </CSSTransition>
  );
};
export default AnimatedRoute;
