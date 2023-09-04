import { Dispatch, RefObject, SetStateAction, useEffect, useRef } from 'react';
import useEventListener from './useEventListener';

type LoadContentFunction<T extends { id: number }> = (
  startIndex: number,
  endIndex: number
) => Promise<T[] | null>;
type SetContent<T extends { id: number }> = Dispatch<SetStateAction<T[]>>;

const useDynamicScroll = <T extends { id: number }>(
  scrollContainerRef: RefObject<HTMLElement>,
  content: T[],
  setContent: SetContent<T>,
  loadContent: LoadContentFunction<T>,
  loadCount: number = 100,
  onLoading?: () => any,
  onLoaded?: () => any
) => {
  const isLoading = useRef(false);
  const allContentLoaded = useRef(false);

  const addContent = async () => {
    isLoading.current = true;
    if (onLoading) onLoading();
    const newContent = await loadContent(content.length + 1, content.length + loadCount);
    isLoading.current = false;
    if (onLoaded) onLoaded();

    if (!newContent) return;
    if (newContent.length === 0) {
      allContentLoaded.current = true;
      return;
    }

    setContent((prev) =>
      prev.concat(newContent.filter((newItem) => prev.every((item) => newItem.id !== item.id)))
    );
  };

  useEventListener(scrollContainerRef, 'scroll', () => {
    const scrollContainer = scrollContainerRef.current;
    if (isLoading.current || allContentLoaded.current || !scrollContainer) return;

    if (
      scrollContainer.scrollTop + scrollContainer.offsetHeight + 200 >=
      scrollContainer.scrollHeight
    ) {
      addContent();
    }
  });

  useEffect(() => {
    addContent();

    return () => {
      isLoading.current = false;
    };
  }, []);
};
export default useDynamicScroll;
