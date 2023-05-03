import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';

const UserModal = () => {
  const { closeModal } = useModal();
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/user');
    closeModal();
  };

  const handleLanguageSwitch = () => {
    // TODO
  };

  const handleThemeSwitch = () => {
    // TODO
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
      <button onClick={handleThemeSwitch}>Тема: светлая</button>
      <button onClick={handleFeedback}>Оставить отзыв</button>
      <button onClick={handleLogOut}>Выход</button>
    </div>
  );
};
export default UserModal;
