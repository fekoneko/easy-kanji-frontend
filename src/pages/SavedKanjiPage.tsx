import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const SavedKanjiPage = () => {
  const { savedKanjis, setSavedKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <div className="mainContent">
      <h1>Сохранённые кандзи</h1>
      <KanjiGrid kanjis={savedKanjis} />
    </div>
  );
};
export default SavedKanjiPage;
