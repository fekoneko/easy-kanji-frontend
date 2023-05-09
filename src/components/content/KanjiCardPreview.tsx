import { CSSProperties, MouseEvent, useRef } from 'react';
import { Kanji } from '../../contexts/kanjiContext';

export type KanjiCardPreviewMode = 'writing' | 'meaning';

type KanjiCardPreviewProps = {
  mode?: KanjiCardPreviewMode;
  kanji: Kanji;
  getSize?: (centerX: number) => number;
  onClick?: (e: MouseEvent) => any;
};

const KanjiCardPreview = ({ mode, kanji, getSize, onClick }: KanjiCardPreviewProps) => {
  const kanjiCardPreviewRef = useRef<HTMLButtonElement>(null);

  const getStyle = (): CSSProperties => {
    if (!kanjiCardPreviewRef.current || !getSize) return {};
    const rect = kanjiCardPreviewRef.current.getBoundingClientRect();
    const size = getSize(rect.left + rect.width / 2);
    return {
      flexBasis: size * size,
      maxWidth: size,
      height: size * 0.7,
    };
  };

  return (
    <button
      ref={kanjiCardPreviewRef}
      className="kanjiCardPreview"
      onClick={(e: any) => {
        if (onClick) onClick(e);
        e.target.blur();
      }}
      style={getStyle()}
    >
      {mode === 'meaning' ? (
        <p className="kanjiMeaning">{kanji.meaning}</p>
      ) : (
        <p className="kanjiWriting">{kanji.writing}</p>
      )}
    </button>
  );
};
export default KanjiCardPreview;
