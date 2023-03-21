import { RefObject, useEffect } from 'react';

type Handler = (event: MouseEvent) => CleanupFunction | void;
type CleanupFunction = () => any;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
  useEffect(() => {
    let cleanupFunction: CleanupFunction | void;
    const onClickOutside = (e: MouseEvent) => {
      const element = ref?.current;
      if (!element || element.contains(e.target as Node)) {
        return;
      }
      cleanupFunction = handler(e);
    };
    addEventListener(mouseEvent, onClickOutside);
    return () => {
      removeEventListener(mouseEvent, onClickOutside);
      if (cleanupFunction) cleanupFunction();
    };
  }, []);
}
export default useOnClickOutside;
