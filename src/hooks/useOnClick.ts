import { RefObject, useEffect } from 'react';

type Handler = (event: MouseEvent) => CleanupFunction | void;
type CleanupFunction = () => any;

function useOnClick<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: Handler,
  mode: 'inside' | 'outside',
  mouseEvent: 'mousedown' | 'mouseup' = 'mousedown'
): void {
  useEffect(() => {
    let cleanupFunction: CleanupFunction | void;
    const onClick = (e: MouseEvent) => {
      const element = ref?.current;
      if (
        !element ||
        (mode === 'outside' && element.contains(e.target as Node)) ||
        (mode === 'inside' && element !== e.target)
      ) {
        return;
      }
      cleanupFunction = handler(e);
    };
    addEventListener(mouseEvent, onClick);
    return () => {
      removeEventListener(mouseEvent, onClick);
      if (cleanupFunction) cleanupFunction();
    };
  }, []);
}
export default useOnClick;
