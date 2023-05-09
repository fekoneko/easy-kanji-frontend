import { DependencyList, RefObject, useEffect } from 'react';

const useEventListener = <K extends keyof HTMLElementEventMap>(
  targetRef: RefObject<HTMLElement>,
  type: K,
  listener: (this: HTMLElement, e: HTMLElementEventMap[K]) => any,
  deps?: DependencyList,
  options?: boolean | EventListenerOptions | undefined
) => {
  useEffect(() => {
    targetRef.current?.addEventListener(type, listener, options);
    return () => targetRef.current?.removeEventListener(type, listener, options);
  }, (deps ?? []).concat([targetRef.current, type, listener]));
};
export default useEventListener;
