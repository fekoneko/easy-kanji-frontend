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
      className="kanjiCell"
      onClick={() => selectDeselectKanji(selectedKanjis, setSelectedKanjis, kanji)}
    >
      <p className="kanjiWriting">{kanji.writing}</p>
      <p className="kanjiMeaning">{kanji.meaning}</p>
      <p className="kanjiMeaning">{isKanjiSelected(selectedKanjis, kanji) ? 'selected' : ''}</p>
    </button>
  );
};
export default KanjiCell;
