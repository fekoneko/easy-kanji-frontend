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
      className={`overflow-hidden rounded-t-sm border-x-[1.5px] border-t-[1.5px] text-sm text-dark-gray transition-none [border-bottom-width:0!important] dark:text-gray ${
        cardRepeated
          ? 'border-dark-gray bg-dark-gray [color:theme("colors.white")!important] dark:border-gray dark:bg-gray dark:[color:theme("colors.soft-black")!important]'
          : ''
      } ${
        active
          ? 'text-black [border-color:theme("colors.black")!important] [border-width:2px_2px_0_2px!important] [zoom:1.15] dark:text-soft-white dark:[border-color:theme("colors.soft-white")!important]'
          : ''
      }`}
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
