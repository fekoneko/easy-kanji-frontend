import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const SavedKanjiPage = () => {
  const { savedKanjis, savedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(savedKanjis);

  return (
    <div className="scrollContent">
      <h1>Сохранённые кандзи</h1>
      {savedKanjis.length > 0 ? (
        <KanjiGrid kanjis={savedKanjis} maxCellWidth={280} maxColumns={3} />
      ) : savedKanjisLoading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
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
