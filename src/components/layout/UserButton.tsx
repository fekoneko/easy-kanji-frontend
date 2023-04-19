import AuthModal from '../modals/AuthModal';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import UserModal from '../modals/userModal';

const UserButton = () => {
  const { auth, setAuth } = useAuth();
  const { showModal } = useModal();

  const handleSignIn = () => {
    showModal(<AuthModal />);
  };
  const handleUser = () => {
    showModal(<UserModal />);
  };

  return (
    <>
      {auth ? (
        <button onClick={handleUser} className="userButton">
          {auth?.username}
        </button>
      ) : (
        <button onClick={handleSignIn} className="userButton">
          Войти
        </button>
      )}
    </>
  );
};
export default UserButton;