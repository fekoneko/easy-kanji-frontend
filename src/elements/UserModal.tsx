import { useState } from 'react';
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';

type Mode = 'reg' | 'log';

const UserModal = () => {
  const [mode, setMode] = useState<Mode>('log');

  switch (mode) {
    case 'reg':
      return (
        <>
          <h1>Регистрация</h1>
          <SignUpForm />
          <p>
            Уже есть аккаунт?{' '}
            <a
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
          <LogInForm />
          <p>
            Нет аккаунта?{' '}
            <a
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
export default UserModal;
