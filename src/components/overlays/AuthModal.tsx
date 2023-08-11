import { useState } from 'react';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';
import useModal from '../../hooks/useModal';
import UserModal from './UserModal';
import { Trans, useTranslation } from 'react-i18next';

type Mode = 'reg' | 'log';

const AuthModal = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('log');
  const { showModal } = useModal();

  switch (mode) {
    case 'reg':
      return (
        <>
          <h1>{t('Modals.Auth.SignUpTitle')}</h1>
          <SignUpForm onSignedUp={() => showModal(<UserModal />)} />
          <p className="text-center">
            <Trans
              i18nKey="Modals.Auth.SignUpHint"
              components={{
                linkElement: (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('log');
                    }}
                  />
                ),
              }}
            />
          </p>
        </>
      );

    default:
      return (
        <>
          <h1>{t('Modals.Auth.SignInTitle')}</h1>
          <SignInForm onLoggedIn={() => showModal(<UserModal />)} />
          <p className="text-center">
            <Trans
              i18nKey="Modals.Auth.SignInHint"
              components={{
                linkElement: (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setMode('reg');
                    }}
                  />
                ),
              }}
            />
          </p>
        </>
      );
  }
};
export default AuthModal;
