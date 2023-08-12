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
      <h1 className="pageTitle">{t('Pages.User.Title')}</h1>
      <figure className="userProfileCard">
        <UserAvatar />
        <div className="userInfo">
          <h1>{auth?.username}</h1>
          <p>{auth?.roles.map((role) => t(`UserRoles.${role}`) ?? role).join(' | ')}</p>
        </div>
      </figure>
      <div className="userPageLinks">
        <Link to="/user/edit">{t('Pages.User.Links.EditProfile')}</Link>
        <ProtectedContent allowedRoles={['Admin']}>
          <Link to="/edit/popular">{t('Pages.User.Links.EditKanji')}</Link>
        </ProtectedContent>
      </div>
    </TitledPage>
  );
};
export default ProfilePage;
