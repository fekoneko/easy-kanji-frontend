import { useContext } from 'react';
import { showModalFunction } from '../App';
import globalContext from '../contexts/globalContext';
import UserModal from './UserModal';

type UserButtonProps = {
  showModal: showModalFunction;
};

const UserButton = ({ showModal }: UserButtonProps) => {
  const { auth, setAuth } = useContext(globalContext);

  const handleLogIn = () => {
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
        <button onClick={handleLogIn} className="userButton">
          Войти
        </button>
      )}
    </>
  );
};
export default UserButton;
