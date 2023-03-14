import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <main role="main">
      <h1>SearchPage</h1>
      <form>
        <input role="search" type="text" placeholder="Поиск кандзи" />
      </form>
      <KanjiGrid kanjis={searchKanjis} />
    </main>
  );
};
export default SearchPage;
