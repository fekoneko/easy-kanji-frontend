import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import { useContext } from 'react';
import settingsContext from '../../contexts/settingsContext';

const UserModal = () => {
  const { closeModal } = useModal();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useContext(settingsContext);

  const handleProfile = () => {
    navigate('/user');
    closeModal();
  };

  const handleLanguageSwitch = () => {
    // TODO
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
      <button onClick={handleProfile}>Профиль</button>
      <button onClick={handleLanguageSwitch}>Язык: русский</button>
      <button onClick={handleThemeSwitch}>Тема: {theme === 'light' ? 'светлая' : 'тёмная'}</button>
      <button onClick={handleFeedback}>Оставить отзыв</button>
      <button onClick={handleLogOut}>Выход</button>
    </div>
  );
};
export default UserModal;
