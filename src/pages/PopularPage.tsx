import { useContext, useEffect } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import kanjisApi from '../api/kanjisApi';

const PopularPage = () => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);

  useEffect(() => {
    const updatePopularKanjis = async () => {
      const newPopularKanjis = await kanjisApi.getKanjiListPart('popular', 1, 100);
      if (newPopularKanjis) setPopularKanjis(newPopularKanjis);
    };
    updatePopularKanjis();
  }, []);

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
