import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';

const SelectedPage = () => {
  const { selectedKanjis } = useContext(kanjiContext);

  return (
    <div className="scrollContent">
      <h1>Выбранные кандзи</h1>
      {selectedKanjis.length > 0 ? (
        <KanjiGrid kanjis={selectedKanjis} />
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
