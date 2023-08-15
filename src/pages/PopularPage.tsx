import { RefObject, useEffect, useRef, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import usePageKanjis from '../hooks/usePageKanjis';
import useToast from '../hooks/useToast';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../components/layout/Loading';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const { t } = useTranslation();
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const titleRef = useRef<HTMLDivElement>(null);
  const { showPopup } = useToast();
  const [loading, setLoading] = useState(false);
  const [getKanjisErrorStatus, setGetKanjisErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, pageKanjis, setPageKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      setGetKanjisErrorStatus,
      setLoading,
      abortControllerRef.current.signal
    )
  );

  useEffect(() => {
    if (getKanjisErrorStatus) showPopup(t('KanjiGrid.Errors.LoadingFailed'));
  }, [getKanjisErrorStatus]);

  return (
    <TitledPage title={t('Pages.Popular.Title')}>
      <div className="mb-4 mt-7 flex items-center justify-between" ref={titleRef}>
        <h1>{t('Pages.Popular.Title')}</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <Trans
            i18nKey="Pages.Popular.Info"
            components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
          />
        </Info>
      </div>

      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} minCellWidth={220} maxColumns={3} />
      ) : loading ? (
        <Loading />
      ) : (
        <div className="content-placeholder">
          <Trans i18nKey="Pages.Popular.Placeholder" components={{ p: <p /> }} />
        </div>
      )}
    </TitledPage>
  );
};
export default PopularPage;
