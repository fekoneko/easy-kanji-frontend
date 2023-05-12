import AuthModal from '../overlays/AuthModal';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import UserModal from '../overlays/UserModal';
import { useTranslation } from 'react-i18next';

const UserButton = () => {
  const { t } = useTranslation();
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
          {t('Layout.Header.SignIn')}
        </button>
      )}
    </>
  );
};
export default UserButton;
