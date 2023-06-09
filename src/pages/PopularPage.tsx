import { RefObject, useEffect, useRef, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import usePageKanjis from '../hooks/usePageKanjis';
import usePopup from '../hooks/usePopup';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const { t } = useTranslation();
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const titleRef = useRef<HTMLDivElement>(null);
  const { showPopup } = usePopup();
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
      <div className="scrollContent">
        <div className="pageTitle" ref={titleRef}>
          <h1>{t('Pages.Popular.Title')}</h1>
          <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
            <Trans
              i18nKey="Pages.Popular.Info"
              components={{ p: <p />, ul: <ul />, li: <li />, span: <span /> }}
            />
          </Info>
        </div>

        {pageKanjis.length > 0 ? (
          <KanjiGrid kanjis={pageKanjis} maxCellWidth={280} maxColumns={3} />
        ) : loading ? (
          <div className="contentPlaceholder">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="contentPlaceholder">
            <Trans i18nKey="Pages.Popular.Placeholder" components={{ p: <p /> }} />
          </div>
        )}
      </div>
    </TitledPage>
  );
};
export default PopularPage;
