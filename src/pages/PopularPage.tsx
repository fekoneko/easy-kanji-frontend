import { RefObject, useContext, useRef } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import useToast from '../hooks/useToast';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../components/content/Loading';
import useLoading from '../hooks/useLoading';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const { t } = useTranslation();
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  const titleRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const [trackKanjiLoading, kanjiLoadingStatus] = useLoading();
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, popularKanjis, setPopularKanjis, async (startIndex, endIndex) => {
    const [kanjis] = await trackKanjiLoading(
      () =>
        kanjisApi.getKanjiListPart(
          'popular',
          startIndex,
          endIndex,
          abortControllerRef.current.signal
        ),
      undefined,
      () => showToast(t('KanjiGrid.Errors.LoadingFailed'))
    );
    return kanjis as Kanji[] | null;
  });

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

      {popularKanjis.length > 0 ? (
        <KanjiGrid kanjis={popularKanjis} minCellWidth={220} maxColumns={3} />
      ) : (
        <Loading status={kanjiLoadingStatus}>
          <div className="content-placeholder">
            <Trans i18nKey="Pages.Popular.Placeholder" components={{ p: <p /> }} />
          </div>
        </Loading>
      )}
    </TitledPage>
  );
};
export default PopularPage;
