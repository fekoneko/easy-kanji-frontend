import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';

const UserModal = () => {
  const { closeModal } = useModal();
  const { auth, setAuth } = useAuth();
  const handleLogOut = () => {
    setAuth(null);
    closeModal();
  };

  return (
    <>
      <h1>(Аватарка) {auth?.username}</h1>
      <h2>Аккаунт</h2>
      <h2>Язык: "Русский"</h2>
      <h2>Тема</h2>
      <button onClick={handleLogOut}>Выход</button>
    </>
  );
};
export default UserModal;
