import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const SelectedPage = () => {
  const { selectedKanjis, selectedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(selectedKanjis);

  return (
    <div className="scrollContent">
      <h1>Выбранные кандзи</h1>
      {selectedKanjis.length > 0 ? (
        <KanjiGrid kanjis={selectedKanjis} />
      ) : selectedKanjisLoading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="contentPlaceholder">
          <p>Вы пока не выбрали ни одного Кандзи</p>
          <p>
            Перейти в раздел <Link to="/popular">Популярные</Link>
          </p>
        </div>
      )}
    </div>
  );
};
export default SelectedPage;
