import { Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useModal from '../../hooks/useModal';
import UserModal from '../overlays/AuthModal';
import { Role } from '../../contexts/authContext';
import { Trans, useTranslation } from 'react-i18next';

type AuthRequiredProps = {
  allowedRoles?: Role[];
};

const AuthRequired = ({ allowedRoles }: AuthRequiredProps) => {
  const { t } = useTranslation();
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
      <div className="content-placeholder">
        <h2>{t('Pages.AuthRequired.AuthRequiredTitle')}</h2>
        <p>
          <Trans
            i18nKey="Pages.AuthRequired.AuthRequiredHint"
            components={{
              linkElement: (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showModal(<UserModal />);
                  }}
                />
              ),
            }}
          />
        </p>
      </div>
    );
  }

  return (
    <div className="content-placeholder">
      <h2>{t('Pages.AuthRequired.UnallowedRoleTitle')}</h2>
      <p>
        <Trans i18nKey="Pages.AuthRequired.UnallowedRoleHint" />
      </p>
    </div>
  );
};
export default AuthRequired;
