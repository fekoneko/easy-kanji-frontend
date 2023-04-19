import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import UserModal from '../modals/AuthModal';
import { Role } from '../../contexts/authContext';

type AuthRequiredProps = {
  allowedRoles?: Role[];
};

const AuthRequired = ({ allowedRoles }: AuthRequiredProps) => {
  const { auth } = useAuth();
  const { showModal } = useModal();

  if (
    auth &&
    (!allowedRoles || allowedRoles.some((allowedRole) => auth.roles.includes(allowedRole)))
  ) {
    return <Outlet />;
  }

  if (!auth) {
    return (
      <div className="scrollContent">
        <div className="contentPlaceholder">
          <h2>Требуется вход</h2>
          <p>
            Пожауйста,{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showModal(<UserModal />);
              }}
            >
              войдите в аккаунт
            </a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollContent">
      <div className="contentPlaceholder">
        <h2>Страница не доступна</h2>
        <p>К сожалению, у вас нет разрешения на просмотр этой страницы :(</p>
      </div>
    </div>
  );
};
export default AuthRequired;
