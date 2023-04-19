import useAuth from '../hooks/useAuth';
import { ReactComponent as UserAvatar } from '../assets/userAvatar.svg';
import { Link } from 'react-router-dom';

const UserPage = () => {
  const { auth } = useAuth();

  return (
    <div className="scrollContent">
      <div className="userPageTop">
        <UserAvatar />
        <div className="userInfo">
          <h1>{auth?.username}</h1>
          <p>{auth?.roles.join(', ')}</p>
        </div>
      </div>
      {auth?.roles.includes('Admin') ? (
        <Link to="/edit/popular">Панель редактирования кандзи</Link>
      ) : (
        <></>
      )}
    </div>
  );
};
export default UserPage;
