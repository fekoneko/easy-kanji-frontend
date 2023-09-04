import { CSSProperties, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

type Size = { width: number; height: number };

type DisplayInViewportProps = {
  viewportRef?: RefObject<HTMLElement>;
  fallbackWidth?: string | number;
  fallbackHeight?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

const DisplayInViewport = ({
  viewportRef,
  fallbackWidth,
  fallbackHeight,
  className,
  style,
  children,
}: DisplayInViewportProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<Size>();

  useEffect(() => {
    if (elementRef.current !== null)
      setSize({
        width: elementRef.current.offsetWidth,
        height: elementRef.current.offsetHeight,
      });
  }, [children]);

  const intersection = useIntersectionObserver(elementRef, {
    root: viewportRef?.current,
  });

  if (intersection?.isIntersecting) {
    return (
      <div ref={elementRef} className={className} style={style}>
        {children}
      </div>
    );
  } else {
    return (
      <div
        ref={elementRef}
        className={className}
        style={{
          width: size?.width ?? fallbackWidth,
          height: size?.height ?? fallbackHeight,
          ...style,
        }}
      ></div>
    );
  }
};
export default DisplayInViewport;
