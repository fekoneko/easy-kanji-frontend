import { RefObject, useEffect, useState } from 'react';

const useResizeObserver = (elementRef: RefObject<HTMLElement>) => {
  const [resizeObserverEntry, setResizeObserverEntry] = useState<ResizeObserverEntry>();

  useEffect(() => {
    if (!elementRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => setResizeObserverEntry(entries.at(-1)));
    resizeObserver.observe(elementRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return resizeObserverEntry;
};
export default useResizeObserver;
