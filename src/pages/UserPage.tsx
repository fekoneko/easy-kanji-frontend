import useAuth from '../hooks/useAuth';
import { ReactComponent as UserAvatar } from '../assets/userAvatar.svg';

const UserPage = () => {
  const { auth } = useAuth();

  return (
    <div className="scrollContent">
      <div className="userPage">
        <UserAvatar />
        <div className="userInfo">
          <h1>{auth?.username}</h1>
          <p>{auth?.roles.join(', ')}</p>
        </div>
      </div>
    </div>
  );
};
export default UserPage;
