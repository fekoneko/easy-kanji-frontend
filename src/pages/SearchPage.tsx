import { useEffect, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import SearchBar from '../components/forms/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import useToast from '../hooks/useToast';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

const SearchPage = () => {
  const { t } = useTranslation();
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchRequest, setSearchRequest] = useState<string>(searchParams.get('s') ?? '');

  const [loading, setLoading] = useState(false);
  const [searchErrorStatus, setSearchErrorStatus] = useState<number | null>(null);
  const { showPopup } = useToast();

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
    if (searchErrorStatus) showPopup(t('KanjiGrid.Errors.LoadingFailed'));
  }, [searchErrorStatus]);

  return (
    <TitledPage title={t('Pages.Search.Title')}>
      <h1 className="mb-4 mt-7">{t('Pages.Search.Title')}</h1>
      <SearchBar searchRequest={searchRequest} setSearchRequest={setSearchRequest} />

      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} minCellWidth={220} maxColumns={3} detailedMode />
      ) : loading ? (
        <div className="content-placeholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="content-placeholder">
          {searchRequest.length > 0 ? (
            <Trans i18nKey="Pages.Search.Placeholders.NotFound" components={{ p: <p /> }} />
          ) : (
            <Trans i18nKey="Pages.Search.Placeholders.EmptyRequest" components={{ p: <p /> }} />
          )}
        </div>
      )}
    </TitledPage>
  );
};
export default SearchPage;
