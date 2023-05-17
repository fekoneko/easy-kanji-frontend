import { CSSProperties, MouseEvent, useContext, useMemo, useRef } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import { isKanjiInList } from '../../controllers/kanjiController';

export type KanjiCardPreviewMode = 'writing' | 'meaning';

type KanjiCardPreviewProps = {
  active?: boolean;
  mode?: KanjiCardPreviewMode;
  kanji: Kanji;
  getSize?: (centerX?: number) => number;
  onClick?: (e: MouseEvent) => any;
};

const KanjiCardPreview = ({ active, mode, kanji, getSize, onClick }: KanjiCardPreviewProps) => {
  const { repeatKanjis } = useContext(kanjiContext);
  const kanjiCardPreviewRef = useRef<HTMLButtonElement>(null);

  const cardRepeated = useMemo(() => isKanjiInList(repeatKanjis, kanji), [repeatKanjis, kanji]);

  const getStyle = (): CSSProperties => {
    if (!getSize) return {};
    const rect = kanjiCardPreviewRef.current?.getBoundingClientRect();
    const size = getSize(rect && rect.left + rect.width / 2);

    return {
      flexBasis: size * size,
      maxWidth: size,
      height: size * 0.7,
    };
  };

  return (
    <button
      ref={kanjiCardPreviewRef}
      className={`kanjiCardPreview${cardRepeated ? ' repeat' : ''}${active ? ' active' : ''}`}
      onClick={(e) => {
        if (onClick) onClick(e);
      }}
      onFocus={(e) => e.target.blur()}
      tabIndex={-1}
      style={getStyle()}
    >
      {mode === 'meaning' ? (
        <p className="kanjiMeaning">{kanji.meaning.split(',')[0]}</p>
      ) : (
        <p className="kanjiWriting">{kanji.writing}</p>
      )}
    </button>
  );
};
export default KanjiCardPreview;
