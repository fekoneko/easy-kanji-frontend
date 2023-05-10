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
  setCurrentIndex: Dispatch<SetStateAction<number>>;
};

const KanjiCardNav = ({ mode, kanjis, setCurrentIndex }: KanjiCardNavProps) => {
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

  return (
    <nav className="kanjiCardNav" ref={kanjiCardNavRef}>
      {kanjis.map((kanji, index) => (
        <KanjiCardPreview
          key={index}
          mode={mode}
          kanji={kanji}
          getSize={getKanjiCardPreviewSize}
          onClick={() => setCurrentIndex(index)}
        />
      ))}
    </nav>
  );
};
export default KanjiCardNav;
