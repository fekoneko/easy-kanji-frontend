import { RefObject, useEffect, useState } from 'react';

const useResizeObserver = (elementRef: RefObject<HTMLElement>) => {
  const [resizeObserverEntry, setResizeObserverEntry] = useState<ResizeObserverEntry>();

  useEffect(() => {
    if (!elementRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => setResizeObserverEntry(entries[0]));
    resizeObserver.observe(elementRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  return resizeObserverEntry;
};
export default useResizeObserver;
