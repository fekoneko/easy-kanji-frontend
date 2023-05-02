import { useEffect, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import SearchBar from '../components/forms/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';

const SearchPage = () => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchRequest, setSearchRequest] = useState<string>(searchParams.get('s') ?? '');

  useEffect(() => {
    const updateSearchKanjis = async () => {
      const searchParamsRequest = searchParams.get('s');
      if (!searchParamsRequest) {
        setPageKanjis([]);
        return;
      }
      const newSearchKanjis = await kanjisApi.searchKanjis(searchParamsRequest);
      if (!newSearchKanjis) return;
      setPageKanjis(newSearchKanjis);
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
      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} maxCellWidth={280} maxColumns={3} detailedMode />
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
