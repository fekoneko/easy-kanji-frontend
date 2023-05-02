import useAuth from '../hooks/useAuth';
import { ReactComponent as UserAvatar } from '../assets/userAvatar.svg';
import { Link } from 'react-router-dom';
import ProtectedContent from '../components/content/ProtectedContent';

const UserPage = () => {
  const { auth } = useAuth();

  return (
    <div className="scrollContent">
      <h1>Мой профиль</h1>
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
  );
};
export default UserPage;
