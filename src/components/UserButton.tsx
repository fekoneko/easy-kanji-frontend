import UserModal from './UserModal';
import useAuth from '../hooks/useAuth';
import useModal from '../hooks/useModal';

const UserButton = () => {
  const { auth, setAuth } = useAuth();
  const { showModal, closeModal } = useModal();

  const handleSignIn = () => {
    showModal(<UserModal />);
  };
  const handleLogOut = () => {
    setAuth(null);
  };

  return (
    <>
      {auth ? (
        <button onClick={handleLogOut} className="userButton">
          Выйти
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
