import { RefObject, useEffect, useState } from 'react';

export type Size = { width: number; height: number };

const useResizeObserver = (elementRef: RefObject<HTMLElement>) => {
  const [resizeObserverEntry, setResizeObserverEntry] = useState<ResizeObserverEntry>();

  useEffect(() => {
    if (!elementRef.current) return;
    const resizeObserver = new ResizeObserver((entry) => setResizeObserverEntry(entry[0]));
    resizeObserver.observe(elementRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return resizeObserverEntry;
};
export default useResizeObserver;
