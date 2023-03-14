import { useContext } from 'react';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';
import { isKanjiSelected, selectDeselectKanji } from '../controllers/kanjiController';

type KanjiCellProps = {
  kanji: Kanji;
};

const KanjiCell = ({ kanji }: KanjiCellProps) => {
  const { selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  return (
    <button
      className={`kanjiCell${isKanjiSelected(selectedKanjis, kanji) ? ' selected' : ''}`}
      onClick={() => selectDeselectKanji(selectedKanjis, setSelectedKanjis, kanji)}
    >
      <p className="kanjiWriting">{kanji.writing}</p>
      <p className="kanjiMeaning">{kanji.meaning}</p>
    </button>
  );
};
export default KanjiCell;
