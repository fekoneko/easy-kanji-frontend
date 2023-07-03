import { RefObject, useEffect, useState } from 'react';

const useIntersectionObserver = (
  elementRef: RefObject<HTMLElement>,
  options?: IntersectionObserverInit
) => {
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    useState<IntersectionObserverEntry>();

  useEffect(() => {
    if (!elementRef.current) return;
    const intersectionObserver = new IntersectionObserver(
      (entries) => setIntersectionObserverEntry(entries[0]),
      options
    );
    intersectionObserver.observe(elementRef.current);

    return () => intersectionObserver.disconnect();
  }, []);

  return intersectionObserverEntry;
};
export default useIntersectionObserver;
