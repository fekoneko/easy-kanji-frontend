import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';
import SearchBar from '../elements/SearchBar';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <div className="mainContent">
      <h1>Поиск кандзи</h1>
      <SearchBar />
      <KanjiGrid kanjis={searchKanjis} />
    </div>
  );
};
export default SearchPage;
