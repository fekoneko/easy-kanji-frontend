import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import { useTranslation } from 'react-i18next';
import { MouseEventHandler } from 'react';

type Button = { title: string; action?: MouseEventHandler<HTMLButtonElement> };

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

  const handleSignOut = () => {
    setAuth(null);
    closeModal();
  };

  const buttons: Button[] = [
    { title: t('Modals.User.Profile'), action: handleProfile },
    { title: t('Modals.User.Feedback'), action: handleFeedback },
    { title: t('Modals.User.SignOut'), action: handleSignOut },
  ];

  return (
    <div className="flex flex-col gap-2">
      <h1 className="mb-2 text-center">{auth?.username}</h1>
      {buttons.map((b, index) => (
        <button
          onClick={b.action}
          key={index}
          className="rounded-sm border-2 px-3 py-1.5 hover:bg-black hover:bg-opacity-10 dark:hover:bg-soft-white dark:hover:bg-opacity-10"
        >
          {b.title}
        </button>
      ))}
    </div>
  );
};
export default UserModal;
