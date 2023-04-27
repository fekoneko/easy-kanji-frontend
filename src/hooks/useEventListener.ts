import { RefObject, useEffect } from 'react';

const useEventListener = <K extends keyof HTMLElementEventMap>(
  targetRef: RefObject<HTMLElement>,
  type: K,
  listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any,
  options?: boolean | EventListenerOptions | undefined
) => {
  useEffect(() => {
    targetRef.current?.addEventListener(type, listener, options);
    return () => targetRef.current?.removeEventListener(type, listener, options);
  }, [targetRef.current, type, listener]);
};
export default useEventListener;
