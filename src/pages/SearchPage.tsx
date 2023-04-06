import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import SearchBar from '../components/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis } = useContext(kanjiContext);
  const [searchRequest, setSearchRequest] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const updateSearchKanjis = async () => {
      const searchParamsRequest = searchParams.get('s');
      if (!searchParamsRequest) return;
      const newSearchKanjis = await kanjisApi.searchKanjis(searchParamsRequest, setError);
      if (!newSearchKanjis) return;
      setSearchKanjis(newSearchKanjis);
    };
    updateSearchKanjis();
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prev) => {
      if (searchRequest) prev.set('s', searchRequest);
      else prev.delete('s');
      return prev;
    });
  }, [searchRequest]);

  return (
    <div className="scrollContent">
      <h1>Поиск кандзи</h1>
      <SearchBar searchRequest={searchRequest} setSearchRequest={setSearchRequest} />
      <KanjiGrid kanjis={searchKanjis} />
    </div>
  );
};
export default SearchPage;
