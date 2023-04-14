import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import SearchBar from '../components/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis } = useContext(kanjiContext);
  const [searchRequest, setSearchRequest] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const updateSearchKanjis = async () => {
      const searchParamsRequest = searchParams.get('s');
      if (!searchParamsRequest) return;
      const newSearchKanjis = await kanjisApi.searchKanjis(searchParamsRequest);
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
      {searchKanjis.length > 0 ? (
        <KanjiGrid kanjis={searchKanjis} />
      ) : (
        <div className="contentPlaceholder">
          {searchRequest !== '' ? (
            <p>По запросу ничего не найдено</p>
          ) : (
            <p>Введите поисковой запрос</p>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchPage;
