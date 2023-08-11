import { Link } from 'react-router-dom';
import UserButton from './UserButton';
import { useTranslation } from 'react-i18next';
import LearnButton from './LearnButton';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="app-paddings flex items-center gap-5 bg-primary py-2 text-white">
      <Link
        className="flex-grow text-3xl font-bold text-white hover:no-underline"
        to="/popular"
        role="banner"
      >
        {t('SiteTitle')}
      </Link>
      <LearnButton />
      <UserButton />
    </header>
  );
};
export default Header;
