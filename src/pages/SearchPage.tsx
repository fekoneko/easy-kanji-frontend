import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  const { searchKanjis } = useContext(kanjiContext);

  return (
    <div className="scrollContent">
      <h1>Поиск кандзи</h1>
      <SearchBar />
      <KanjiGrid kanjis={searchKanjis} />
    </div>
  );
};
export default SearchPage;
