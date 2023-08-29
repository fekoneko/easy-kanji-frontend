import { useRef } from 'react';
import { Routes, RoutesProps, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition, TransitionGroup } from 'react-transition-group';

const AnimatedRoutes = ({ ...routesProps }: RoutesProps) => {
  const location = useLocation();
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <TransitionGroup component={null}>
      <SwitchTransition mode={'out-in'}>
        <CSSTransition
          key={location.pathname}
          timeout={150}
          classNames="vertical-slide-transition"
          nodeRef={nodeRef}
        >
          <div className="flex flex-grow flex-col" ref={nodeRef}>
            <Routes {...routesProps} location={location} />
          </div>
        </CSSTransition>
      </SwitchTransition>
    </TransitionGroup>
  );
};
export default AnimatedRoutes;
