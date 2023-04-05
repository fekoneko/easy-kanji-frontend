import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import kanjisApi from '../api/kanjisApi';

const PopularPage = () => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const updatePopularKanjis = async () => {
      const newPopularKanjis = await kanjisApi.getKanjiListPart('popular', 1, 100, setError);
      if (newPopularKanjis) setPopularKanjis(newPopularKanjis);
      setIsLoading(false);
    };
    updatePopularKanjis();
  }, []);

  return (
    <div className="scrollContent">
      <h1>Популярные кандзи</h1>
      <KanjiGrid kanjis={popularKanjis} />
    </div>
  );
};
export default PopularPage;
