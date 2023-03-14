import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';
import SearchBar from '../elements/SearchBar';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <main role="main">
      <h1>Поиск кандзи</h1>
      <SearchBar />
      <KanjiGrid kanjis={searchKanjis} />
    </main>
  );
};
export default SearchPage;
