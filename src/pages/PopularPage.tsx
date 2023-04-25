import { useContext, useEffect } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';

const PopularPage = () => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  useDynamicScroll(popularKanjis, setPopularKanjis);

  return (
    <div className="scrollContent">
      <h1>Популярные кандзи</h1>
      {popularKanjis.length > 0 ? (
        <KanjiGrid kanjis={popularKanjis} />
      ) : (
        <div className="contentPlaceholder">
          <p>Тут пока ничего нет</p>
        </div>
      )}
    </div>
  );
};
export default PopularPage;
