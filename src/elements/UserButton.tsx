import { useContext } from 'react';
import { showModalFunction } from '../App';
import globalContext from '../contexts/globalContext';

type UserButtonProps = {
  showModal: showModalFunction;
};

const UserButton = ({ showModal }: UserButtonProps) => {
  const { auth, setAuth } = useContext(globalContext);

  const handleLogIn = () => {
    showModal(<p>LogInForm</p>);
  };
  const handleLogOut = () => {
    setAuth(null);
  };

  return (
    <>
      {auth ? (
        <button onClick={handleLogOut} className="userButton">
          Log Out
        </button>
      ) : (
        <button onClick={handleLogIn} className="userButton">
          Log In
        </button>
      )}
    </>
  );
};
export default UserButton;
