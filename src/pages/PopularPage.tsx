import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const PopularPage = () => {
  const { popularKanjis, setPopularKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <div className="mainContent">
      <h1>Популярные кандзи</h1>
      <KanjiGrid kanjis={popularKanjis} />
    </div>
  );
};
export default PopularPage;
