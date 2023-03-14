import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const PopularPage = () => {
  const { popularKanjis, setPopularKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <main role="main">
      <h1>PopularPage</h1>
      <KanjiGrid kanjis={popularKanjis} />
    </main>
  );
};
export default PopularPage;
