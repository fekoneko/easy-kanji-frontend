import { useContext, useRef } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

const SelectedPage = () => {
  const { t } = useTranslation();
  const { selectedKanjis, selectedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(selectedKanjis);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title={t('Pages.Selected.Title')}>
      <div className="scrollContent">
        <div className="pageTitle" ref={titleRef}>
          <h1>{t('Pages.Selected.Title')}</h1>
          <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
            <Trans
              i18nKey="Pages.Selected.Info"
              components={{ p: <p />, ul: <ul />, li: <li />, span: <span /> }}
            />
          </Info>
        </div>

        {selectedKanjis.length > 0 ? (
          <KanjiGrid kanjis={selectedKanjis} maxCellWidth={280} maxColumns={3} />
        ) : selectedKanjisLoading ? (
          <div className="contentPlaceholder">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="contentPlaceholder">
            <Trans
              i18nKey="Pages.Selected.Placeholder"
              components={{ linkElement: <Link to="/popular" />, p: <p /> }}
            />
          </div>
        )}
      </div>
    </TitledPage>
  );
};
export default SelectedPage;
