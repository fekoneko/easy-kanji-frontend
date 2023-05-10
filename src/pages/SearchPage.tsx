import { useEffect, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import SearchBar from '../components/forms/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import usePopup from '../hooks/usePopup';
import LoadingSpinner from '../components/animations/LoadingSpinner';

const SearchPage = () => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchRequest, setSearchRequest] = useState<string>(searchParams.get('s') ?? '');

  const [loading, setLoading] = useState(false);
  const [searchErrorStatus, setSearchErrorStatus] = useState<number | null>(null);
  const { showPopup } = usePopup();

  useEffect(() => {
    setSearchErrorStatus(null);
  }, [searchRequest]);

  useEffect(() => {
    const abortController = new AbortController();

    const updateSearchKanjis = async () => {
      const searchParamsRequest = searchParams.get('s');
      if (!searchParamsRequest) {
        setPageKanjis([]);
        return;
      }

      const newSearchKanjis = await kanjisApi.searchKanjis(
        searchParamsRequest,
        setSearchErrorStatus,
        setLoading,
        abortController.signal
      );

      if (!newSearchKanjis) return;
      setPageKanjis(newSearchKanjis);
    };
    updateSearchKanjis();
    return () => {
      abortController.abort();
      setLoading(false);
    };
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prev) => {
      if (searchRequest) prev.set('s', searchRequest);
      else prev.delete('s');
      return prev;
    });
  }, [searchRequest]);

  useEffect(() => {
    if (searchErrorStatus) showPopup('Ошибка поиска');
  }, [searchErrorStatus]);

  return (
    <div className="scrollContent">
      <h1 className="pageTitle">Поиск кандзи</h1>
      <SearchBar searchRequest={searchRequest} setSearchRequest={setSearchRequest} />

      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} maxCellWidth={280} maxColumns={3} detailedMode />
      ) : loading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
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
