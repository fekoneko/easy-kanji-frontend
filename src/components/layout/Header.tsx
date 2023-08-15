import { Link } from 'react-router-dom';
import UserButton from './UserButton';
import { useTranslation } from 'react-i18next';
import LearnButton from './LearnButton';
import ShowAtMedia from './ShowAtMedia';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="app-paddings flex justify-center gap-x-5 gap-y-2 bg-primary py-2 text-white [@media(max-width:420px)]:flex-col [@media(min-width:420px)]:items-center">
      <Link
        className="text-center text-3xl font-bold text-white hover:no-underline [@media(min-width:420px)]:mr-auto"
        to="/popular"
        role="banner"
      >
        {t('SiteTitle')}
      </Link>
      <LearnButton />

      <ShowAtMedia min="xs">
        <UserButton />
      </ShowAtMedia>
    </header>
  );
};
export default Header;
