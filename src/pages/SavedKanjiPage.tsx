import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';

const SavedKanjiPage = () => {
  const { savedKanjis } = useContext(kanjiContext);
  usePageKanjis(savedKanjis);

  return (
    <div className="scrollContent">
      <h1>Сохранённые кандзи</h1>
      {savedKanjis.length > 0 ? (
        <KanjiGrid kanjis={savedKanjis} />
      ) : (
        <div className="contentPlaceholder">
          <p>Вы пока не сохранили ни одного Кандзи</p>
          <p>
            Перейти в раздел <Link to="/popular">Популярные</Link>
          </p>
        </div>
      )}
    </div>
  );
};
export default SavedKanjiPage;
