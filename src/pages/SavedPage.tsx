import { useContext, useRef } from 'react';
import kanjisContext from '../contexts/kanjisContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../components/content/Loading';

const SavedPage = () => {
  const { t } = useTranslation();
  const { savedKanjis, savedLoadingStatus } = useContext(kanjisContext);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title={t('Pages.Saved.Title')}>
      <div className="mb-4 mt-7 flex items-center justify-between" ref={titleRef}>
        <h1>{t('Pages.Saved.Title')}</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <Trans
            i18nKey="Pages.Saved.Info"
            components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
          />
        </Info>
      </div>

      <Loading status={savedLoadingStatus}>
        {savedKanjis.length > 0 ? (
          <KanjiGrid kanjis={savedKanjis} minCellWidth={220} maxColumns={3} />
        ) : (
          <div className="content-placeholder">
            <Trans
              i18nKey="Pages.Saved.Placeholder"
              components={{ linkElement: <Link to="/popular" />, p: <p /> }}
            />
          </div>
        )}
      </Loading>
    </TitledPage>
  );
};
export default SavedPage;
