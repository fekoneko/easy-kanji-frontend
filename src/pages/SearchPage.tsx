import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import SearchBar from '../components/forms/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';

const SearchPage = () => {
  const { searchKanjis, setSearchKanjis } = useContext(kanjiContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchRequest, setSearchRequest] = useState<string>(searchParams.get('s') ?? '');

  useEffect(() => {
    const updateSearchKanjis = async () => {
      const searchParamsRequest = searchParams.get('s');
      if (!searchParamsRequest) {
        setSearchKanjis([]);
        return;
      }
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
        <KanjiGrid kanjis={searchKanjis} maxCellWidth={280} maxColumns={3} detailedMode />
      ) : (
        <div className="contentPlaceholder">
          {searchRequest.length > 0 ? (
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
