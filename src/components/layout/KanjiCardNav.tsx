import { Dispatch, SetStateAction, useMemo, useRef } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiCardPreview, { KanjiCardPreviewMode } from '../content/KanjiCardPreview';
import useMousePosition from '../../hooks/useMousePosition';

const PREVIEW_MIN_SIZE = 35;
const PREVIEW_MAX_SIZE = 80;
const PREVIEW_REACT_DISTANCE = 100;

type KanjiCardNavProps = {
  mode?: KanjiCardPreviewMode;
  kanjis: Kanji[];
  currentIndex: number;
  setCurrentIndex: Dispatch<SetStateAction<number>>;
  navCardCount: number;
};

const KanjiCardNav = ({
  mode,
  kanjis,
  currentIndex,
  setCurrentIndex,
  navCardCount,
}: KanjiCardNavProps) => {
  const mousePosition = useMousePosition();
  const kanjiCardNavRef = useRef<HTMLElement>(null);

  const active = useMemo<boolean>(() => {
    if (!kanjiCardNavRef.current) return false;
    const kanjiCardNavRect = kanjiCardNavRef.current.getBoundingClientRect();

    return (
      mousePosition.x >= kanjiCardNavRect.left - PREVIEW_REACT_DISTANCE &&
      mousePosition.x <= kanjiCardNavRect.right + PREVIEW_REACT_DISTANCE &&
      mousePosition.y >= kanjiCardNavRect.bottom - PREVIEW_REACT_DISTANCE &&
      mousePosition.y <= kanjiCardNavRect.bottom + PREVIEW_REACT_DISTANCE
    );
  }, [mousePosition]);

  const getKanjiCardPreviewSize = (centerX?: number) => {
    if (!active || centerX === undefined || !kanjiCardNavRef.current) return PREVIEW_MIN_SIZE;

    const centerY = kanjiCardNavRef.current.getBoundingClientRect().bottom;
    const delta = Math.hypot(centerX - mousePosition.x, centerY - mousePosition.y);
    if (delta > PREVIEW_REACT_DISTANCE) {
      return PREVIEW_MIN_SIZE;
    } else {
      return (
        PREVIEW_MAX_SIZE - (delta * (PREVIEW_MAX_SIZE - PREVIEW_MIN_SIZE)) / PREVIEW_REACT_DISTANCE
      );
    }
  };

  let startIndex = Math.ceil(currentIndex - navCardCount / 2);
  let endIndex = Math.ceil(currentIndex + navCardCount / 2);
  if (startIndex < 0 && endIndex > kanjis.length) {
    startIndex = 0;
    endIndex = kanjis.length;
  } else {
    if (startIndex < 0) {
      endIndex -= startIndex;
      startIndex = 0;
    } else if (endIndex > kanjis.length) {
      startIndex += kanjis.length - endIndex;
      endIndex = kanjis.length;
    }
  }

  return (
    <nav
      className="absolute bottom-0 flex w-full min-w-full max-w-full items-end justify-center gap-0.5 overflow-x-hidden"
      ref={kanjiCardNavRef}
    >
      {kanjis.slice(startIndex, endIndex).map((kanji, index) => (
        <KanjiCardPreview
          key={startIndex + index}
          active={startIndex + index === currentIndex}
          mode={mode}
          kanji={kanji}
          getSize={getKanjiCardPreviewSize}
          onClick={() => setCurrentIndex(startIndex + index)}
        />
      ))}
    </nav>
  );
};
export default KanjiCardNav;
