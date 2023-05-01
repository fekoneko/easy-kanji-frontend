import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../content/Tooltip';
import usersApi from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';

type SignInFormProps = {
  onLoggedIn?: (e: FormEvent) => any;
};

const SignInForm = ({ onLoggedIn }: SignInFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [signInErrorStatus, setSignInErrorStatus] = useState<number | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const abortControllerRef = useAbortController();

  useEffect(() => {
    if (signInErrorStatus) setSignInErrorStatus(null);
  }, [username, password]);

  useEffect(() => {
    if (signInErrorStatus === 404) {
      setUsernameValid(false);
      setPasswordValid(true);
      usernameRef.current?.focus();
    } else if (signInErrorStatus === 400) {
      setUsernameValid(true);
      setPasswordValid(false);
      passwordRef.current?.focus();
    }
  }, [signInErrorStatus]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setUsernameValid(true);
    setPasswordValid(true);
    const newAuth = await usersApi.signIn(
      username,
      password,
      setSignInErrorStatus,
      abortControllerRef.current.signal
    );
    if (!newAuth) return;
    setAuth(newAuth);
    if (onLoggedIn) onLoggedIn(e);
  };

  return (
    <form className="SignInForm" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="usernameInput">Логин:</label>
        <input
          ref={usernameRef}
          id="usernameInput"
          type="text"
          autoFocus
          placeholder="Введите логин…"
          autoComplete="off"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          aria-describedby="usernameHint"
          aria-invalid={usernameValid || !username ? 'false' : 'true'}
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
      </fieldset>
      <Tooltip id="usernameHint" shown={!usernameValid && usernameFocus} anchorRef={usernameRef}>
        Пользователя с таким именем не существует
      </Tooltip>

      <fieldset>
        <label htmlFor="passwordInput">Пароль:</label>
        <input
          ref={passwordRef}
          id="passwordInput"
          type="password"
          placeholder="Введите пароль…"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          aria-describedby="passwordHint"
          aria-invalid={passwordValid || !password ? 'false' : 'true'}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
      </fieldset>
      <Tooltip id="passwordHint" shown={!passwordValid && passwordFocus} anchorRef={passwordRef}>
        Пароль введён неверно
      </Tooltip>

      <button ref={submitRef} type="submit">
        Войти
      </button>
      <Tooltip
        shown={!!signInErrorStatus && ![400, 404].includes(signInErrorStatus)}
        anchorRef={submitRef}
      >
        Неизвестная ошибка авторизации
      </Tooltip>
    </form>
  );
};
export default SignInForm;
