import { useContext, useRef } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';
import Loading from '../components/content/Loading';

const SelectedPage = () => {
  const { t } = useTranslation();
  const { selectedKanjis, selectedLoadingStatus } = useContext(kanjiContext);
  usePageKanjis(selectedKanjis);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title={t('Pages.Selected.Title')}>
      <div className="mb-4 mt-7 flex items-center justify-between" ref={titleRef}>
        <h1>{t('Pages.Selected.Title')}</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <Trans
            i18nKey="Pages.Selected.Info"
            components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
          />
        </Info>
      </div>

      <Loading status={selectedLoadingStatus}>
        {selectedKanjis.length > 0 ? (
          <KanjiGrid kanjis={selectedKanjis} minCellWidth={220} maxColumns={3} />
        ) : (
          <div className="content-placeholder">
            <Trans
              i18nKey="Pages.Selected.Placeholder"
              components={{ linkElement: <Link to="/popular" />, p: <p /> }}
            />
          </div>
        )}
      </Loading>
    </TitledPage>
  );
};
export default SelectedPage;
