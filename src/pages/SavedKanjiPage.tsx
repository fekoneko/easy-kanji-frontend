import { useContext, useRef } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

const SavedKanjiPage = () => {
  const { t } = useTranslation();
  const { savedKanjis, savedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(savedKanjis);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title={t('Pages.SavedKanji.Title')}>
      <div className="mb-4 mt-7 flex items-center justify-between" ref={titleRef}>
        <h1>{t('Pages.SavedKanji.Title')}</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <Trans
            i18nKey="Pages.SavedKanji.Info"
            components={{ p: <p />, ul: <ul />, li: <li />, key: <span className="key" /> }}
          />
        </Info>
      </div>

      {savedKanjis.length > 0 ? (
        <KanjiGrid kanjis={savedKanjis} minCellWidth={220} maxColumns={3} />
      ) : savedKanjisLoading ? (
        <div className="content-placeholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="content-placeholder">
          <Trans
            i18nKey="Pages.SavedKanji.Placeholder"
            components={{ linkElement: <Link to="/popular" />, p: <p /> }}
          />
        </div>
      )}
    </TitledPage>
  );
};
export default SavedKanjiPage;
