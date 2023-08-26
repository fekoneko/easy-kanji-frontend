import { useEffect, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import SearchBar from '../components/forms/SearchBar';
import kanjisApi from '../api/kanjisApi';
import { useSearchParams } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import useToast from '../hooks/useToast';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../components/content/Loading';
import useLoading from '../hooks/useLoading';
import useAbortController from '../hooks/useAbortController';
import { Kanji } from '../contexts/kanjiContext';

const SearchPage = () => {
  const { t } = useTranslation();
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchRequest, setSearchRequest] = useState<string>(searchParams.get('s') ?? '');

  const [trackSearch, searchStatus] = useLoading();
  const abortControllerRef = useAbortController();
  const { showToast } = useToast();

  useEffect(() => {
    const searchParamsRequest = searchParams.get('s');
    if (!searchParamsRequest) {
      setPageKanjis([]);
      return;
    }

    trackSearch(
      () => kanjisApi.searchKanjis(searchParamsRequest, abortControllerRef.current.signal),
      (newSearchKanjis) => setPageKanjis(newSearchKanjis as Kanji[]),
      () => showToast(t('KanjiGrid.Errors.LoadingFailed'))
    );
  }, [searchParams]);

  useEffect(() => {
    setSearchParams((prev) => {
      if (searchRequest) prev.set('s', searchRequest);
      else prev.delete('s');
      return prev;
    });
  }, [searchRequest]);

  return (
    <TitledPage title={t('Pages.Search.Title')}>
      <h1 className="mb-4 mt-7">{t('Pages.Search.Title')}</h1>
      <SearchBar searchRequest={searchRequest} setSearchRequest={setSearchRequest} />

      <Loading status={searchStatus}>
        {pageKanjis.length > 0 ? (
          <KanjiGrid kanjis={pageKanjis} minCellWidth={220} maxColumns={3} detailedMode />
        ) : (
          <div className="content-placeholder">
            {searchRequest.length > 0 ? (
              <Trans i18nKey="Pages.Search.Placeholders.NotFound" components={{ p: <p /> }} />
            ) : (
              <Trans i18nKey="Pages.Search.Placeholders.EmptyRequest" components={{ p: <p /> }} />
            )}
          </div>
        )}
      </Loading>
    </TitledPage>
  );
};
export default SearchPage;
