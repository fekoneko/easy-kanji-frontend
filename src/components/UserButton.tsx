import { useContext } from 'react';
import { closeModalFunction, showModalFunction } from '../App';
import globalContext from '../contexts/globalContext';
import UserModal from './UserModal';

type UserButtonProps = {
  showModal: showModalFunction;
  closeModal: closeModalFunction;
};

const UserButton = ({ showModal, closeModal }: UserButtonProps) => {
  const { auth, setAuth } = useContext(globalContext);

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
