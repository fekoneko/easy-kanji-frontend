import { useState } from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { closeModalFunction } from '../App';

type Mode = 'reg' | 'log';

type UserModalProps = {
  closeModal: closeModalFunction;
};

const UserModal = ({ closeModal }: UserModalProps) => {
  const [mode, setMode] = useState<Mode>('log');

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
export default UserModal;
