import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const PopularPage = () => {
  const { popularKanjis } = useContext(kanjiContext);

  return (
    <div className="scrollContent">
      <h1>Популярные кандзи</h1>
      <KanjiGrid kanjis={popularKanjis} />
    </div>
  );
};
export default PopularPage;
