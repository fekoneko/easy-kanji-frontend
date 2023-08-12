import { Link } from 'react-router-dom';
import TitledPage from '../components/routing/TitledPage';
import { Trans, useTranslation } from 'react-i18next';

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <TitledPage title={t('Pages.NotFound.Title')}>
      <div className="content-placeholder">
        <h1>{t('Pages.NotFound.Code')}</h1>
        <h2>{t('Pages.NotFound.Title')}</h2>
        <p>
          <Trans
            i18nKey="Pages.NotFound.Hint"
            components={{ linkElement: <Link to="/popular" /> }}
          />
        </p>
      </div>
    </TitledPage>
  );
};
export default PageNotFound;
