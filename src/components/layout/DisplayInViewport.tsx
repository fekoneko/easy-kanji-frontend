import { ReactNode, RefObject, useRef } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

type DisplayInViewportProps = {
  forceDisplay?: boolean;
  viewPortRef?: RefObject<HTMLElement>;
  children?: ReactNode;
};

const DisplayInViewport = ({ forceDisplay, viewPortRef, children }: DisplayInViewportProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  const intersection = useIntersectionObserver(elementRef, {
    root: viewPortRef?.current,
  });

  if (forceDisplay || intersection?.isIntersecting) {
    return <div ref={elementRef}>{children}</div>;
  } else {
    return (
      <div
        ref={elementRef}
        style={{
          width: (intersection?.target as HTMLElement)?.offsetWidth,
          height: (intersection?.target as HTMLElement)?.offsetHeight,
        }}
      ></div>
    );
  }
};
export default DisplayInViewport;
