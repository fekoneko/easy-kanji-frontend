import { Link, useLocation } from 'react-router-dom';
import UserButton from './UserButton';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <header>
      <Link className="siteTitle" to="/popular" role="banner">
        {t('SiteTitle')}
      </Link>
      {location.pathname.split('/')[1] === 'learn' ? (
        <Link className="learnButton" to={location.state?.from ?? '/popular'}>
          {t('Layout.Header.LeaveLearnMode')}
        </Link>
      ) : (
        <Link className="learnButton" to="/learn/by-meaning" state={{ from: location.pathname }}>
          {t('Layout.Header.LearnMode')}
        </Link>
      )}
      <UserButton />
    </header>
  );
};
export default Header;
