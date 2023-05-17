import { Link } from 'react-router-dom';
import UserButton from './UserButton';
import { useTranslation } from 'react-i18next';
import LearnButton from './LearnButton';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header>
      <Link className="siteTitle" to="/popular" role="banner">
        {t('SiteTitle')}
      </Link>
      <LearnButton />
      <UserButton />
    </header>
  );
};
export default Header;
