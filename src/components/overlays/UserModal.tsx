import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import { useTranslation } from 'react-i18next';

const UserModal = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/user');
    closeModal();
  };

  const handleFeedback = () => {
    navigate('/feedback');
    closeModal();
  };

  const handleLogOut = () => {
    setAuth(null);
    closeModal();
  };

  return (
    <div className="userModal">
      <h1>{auth?.username}</h1>
      <button onClick={handleProfile}>{t('Modals.User.Profile')}</button>
      <button onClick={handleFeedback}>{t('Modals.User.Feedback')}</button>
      <button onClick={handleLogOut}>{t('Modals.User.SignOut')}</button>
    </div>
  );
};
export default UserModal;
