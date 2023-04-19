import { useState } from 'react';
import SignInForm from '../forms/SignInForm';
import SignUpForm from '../forms/SignUpForm';
import useModal from '../../hooks/useModal';

type Mode = 'reg' | 'log';

const AuthModal = () => {
  const [mode, setMode] = useState<Mode>('log');
  const { closeModal } = useModal();

  switch (mode) {
    case 'reg':
      return (
        <>
          <h1>Регистрация</h1>
          <SignUpForm onSignedUp={closeModal} />
          <p>
            Уже есть акаунт?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode('log');
              }}
            >
              Войдите
            </a>
          </p>
        </>
      );

    default:
      return (
        <>
          <h1>Вход</h1>
          <SignInForm onLoggedIn={closeModal} />
          <p>
            Нет акаунта?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setMode('reg');
              }}
            >
              Зарегистрируйтесь
            </a>
          </p>
        </>
      );
  }
};
export default AuthModal;
