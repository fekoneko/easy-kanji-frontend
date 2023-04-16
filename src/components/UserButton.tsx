import { closeModalFunction, showModalFunction } from '../App';
import UserModal from './UserModal';
import useAuth from '../hooks/useAuth';

type UserButtonProps = {
  showModal: showModalFunction;
  closeModal: closeModalFunction;
};

const UserButton = ({ showModal, closeModal }: UserButtonProps) => {
  const { auth, setAuth } = useAuth();

  const handleSignIn = () => {
    showModal(<UserModal closeModal={closeModal} />);
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
