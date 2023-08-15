import useAuth from '../hooks/useAuth';
import { ReactComponent as UserAvatar } from '../assets/userAvatar.svg';
import { Link } from 'react-router-dom';
import ProtectedContent from '../components/content/ProtectedContent';
import TitledPage from '../components/routing/TitledPage';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { auth } = useAuth();

  return (
    <TitledPage title={t('Pages.User.Title')}>
      <h1 className="mb-4 mt-7">{t('Pages.User.Title')}</h1>

      <figure className="mb-2.5 flex items-center justify-center gap-2 rounded-md border-2 border-dark-gray p-3 dark:border-gray [&>svg]:h-20 [&>svg]:w-20">
        <UserAvatar />
        <div>
          <h1>{auth?.username}</h1>
          <p className="text-dark-gray dark:text-gray">
            {auth?.roles.map((role) => t(`UserRoles.${role}`) ?? role).join(' | ')}
          </p>
        </div>
      </figure>
      <div className="flex flex-wrap gap-x-4">
        <Link to="/user/edit">{t('Pages.User.Links.EditProfile')}</Link>
        <ProtectedContent allowedRoles={['Admin']}>
          <Link to="/edit/popular">{t('Pages.User.Links.EditKanji')}</Link>
        </ProtectedContent>
      </div>
    </TitledPage>
  );
};
export default ProfilePage;
