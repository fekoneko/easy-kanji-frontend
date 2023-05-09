import { DependencyList, useEffect } from 'react';

const useWindowEventListener = <K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, e: WindowEventMap[K]) => any,
  deps?: DependencyList,
  options?: boolean | EventListenerOptions | undefined
) => {
  useEffect(() => {
    window.addEventListener(type, listener, options);
    return () => window.removeEventListener(type, listener, options);
  }, (deps ?? []).concat([type, listener]));
};
export default useWindowEventListener;
