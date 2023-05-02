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
  loadCount: number = 50,
  onLoading?: () => any,
  onLoaded?: () => any
) => {
  const isLoading = useRef(false);
  const allContentLoaded = useRef(false);

  const updateContent = async (override: boolean = false) => {
    isLoading.current = true;
    if (onLoading) onLoading();
    const newContent = await loadContent(
      (override ? 0 : content.length) + 1,
      (override ? 0 : content.length) + loadCount
    );
    isLoading.current = false;
    if (onLoaded) onLoaded();

    if (!newContent) return;
    if (newContent.length === 0) {
      allContentLoaded.current = true;
      return;
    }
    if (override) {
      setContent(newContent.sort((item) => item.id));
    } else {
      setContent((prev) =>
        prev
          .concat(newContent.filter((newItem) => prev.every((item) => newItem.id !== item.id)))
          .sort((item) => item.id)
      );
    }
  };

  useEventListener(scrollContainerRef, 'scroll', (e) => {
    if (isLoading.current || allContentLoaded.current || !e.target) return;
    const scrollContainer = e.target as HTMLElement;

    if (
      scrollContainer.scrollTop + scrollContainer.offsetHeight + 20 >=
      scrollContainer.scrollHeight
    ) {
      updateContent();
    }
  });

  useEffect(() => {
    // TODO: make shure scroll bar apears and stay on resize
    updateContent(true);
    return () => {
      isLoading.current = false;
      setContent([]);
    };
  }, []);
};
export default useDynamicScroll;
