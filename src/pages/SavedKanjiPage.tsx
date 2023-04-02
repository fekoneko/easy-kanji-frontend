import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';

const SavedKanjiPage = () => {
  const { savedKanjis } = useContext(kanjiContext);

  return (
    <div className="scrollContent">
      <h1>Сохранённые кандзи</h1>
      <KanjiGrid kanjis={savedKanjis} />
    </div>
  );
};
export default SavedKanjiPage;
