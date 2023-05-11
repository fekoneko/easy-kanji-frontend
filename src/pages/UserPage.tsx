import useAuth from '../hooks/useAuth';
import { ReactComponent as UserAvatar } from '../assets/userAvatar.svg';
import { Link } from 'react-router-dom';
import ProtectedContent from '../components/content/ProtectedContent';
import TitledPage from '../components/routing/TitledPage';

const UserPage = () => {
  const { auth } = useAuth();

  return (
    <TitledPage title="Мой профиль">
      <div className="scrollContent">
        <h1 className="pageTitle">Мой профиль</h1>
        <figure className="userProfileCard">
          <UserAvatar />
          <div className="userInfo">
            <h1>{auth?.username}</h1>
            <p>{auth?.roles.join(', ')}</p>
          </div>
        </figure>
        <div className="userPageOptions">
          <Link to="/user/edit">Редактировать профиль</Link>
          <ProtectedContent allowedRoles={['Admin']}>
            <Link to="/edit/popular">Панель редактирования кандзи</Link>
          </ProtectedContent>
        </div>
      </div>
    </TitledPage>
  );
};
export default UserPage;
