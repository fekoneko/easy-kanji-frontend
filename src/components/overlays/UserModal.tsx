import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import { useContext } from 'react';
import settingsContext from '../../contexts/settingsContext';
import { useTranslation } from 'react-i18next';

const UserModal = () => {
  const { t } = useTranslation();
  const { closeModal } = useModal();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage } = useContext(settingsContext);

  const handleProfile = () => {
    navigate('/user');
    closeModal();
  };

  const handleLanguageSwitch = () => {
    setLanguage((prev) => (prev === 'ru' ? 'ja' : 'ru'));
  };

  const handleThemeSwitch = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
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
      <button onClick={handleLanguageSwitch}>
        Язык: {language === 'ru' ? 'русский' : 'японский'}
      </button>
      <button onClick={handleThemeSwitch}>Тема: {theme === 'light' ? 'светлая' : 'тёмная'}</button>
      <button onClick={handleFeedback}>{t('Modals.User.Feedback')}</button>
      <button onClick={handleLogOut}>{t('Modals.User.SignOut')}</button>
    </div>
  );
};
export default UserModal;
