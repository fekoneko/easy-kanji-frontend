import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../content/Tooltip';
import userApi from '../../api/userApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

type EditUserFormProps = {
  onSignedUp?: (e: FormEvent) => any;
};

const EditUserForm = ({ onSignedUp }: EditUserFormProps) => {
  const { auth } = useAuth();

  const [username, setUsername] = useState<string>(auth?.username ?? '');
  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [oldPasswordValid, setOldPasswordValid] = useState<boolean>(false);
  const [oldPasswordFocus, setOldPasswordFocus] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const [confirm, setConfirm] = useState<string>('');
  const [confirmValid, setConfirmValid] = useState<boolean>(false);
  const [confirmFocus, setConfirmFocus] = useState<boolean>(false);
  const [signUpErrorStatus, setSignUpErrorStatus] = useState<number | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const abortControllerRef = useAbortController();

  const validateUsername = (): boolean => USERNAME_REGEX.test(username);
  const validatePassword = (): boolean => PASSWORD_REGEX.test(password);
  const validateConfirm = (): boolean => confirm === password;

  useEffect(() => {
    setUsernameValid(validateUsername());
  }, [username]);

  useEffect(() => {
    setPasswordValid(validatePassword());
  }, [password]);

  useEffect(() => {
    setConfirmValid(validateConfirm());
  }, [confirm, password]);

  useEffect(() => {
    setSignUpErrorStatus(null);
  }, [username, password, confirm]);

  useEffect(() => {
    if (signUpErrorStatus === 400) {
      usernameRef.current?.focus();
    }
  }, [signUpErrorStatus]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const curUsernameValid = validateUsername();
    const curPasswordValid = validatePassword();
    const curConfirmValid = validateConfirm();
    setUsernameValid(curUsernameValid);
    setPasswordValid(curPasswordValid);
    setConfirmValid(curConfirmValid);
    if (curUsernameValid && curPasswordValid && curConfirmValid) {
      const newAuth = await userApi.signUp(
        //TODO
        username,
        password,
        setSignUpErrorStatus,
        undefined,
        abortControllerRef.current.signal
      );
      if (!newAuth) return;
      setAuth(newAuth);
      if (onSignedUp) onSignedUp(e);
    } else {
      if (!curUsernameValid) usernameRef.current?.focus();
      else if (!curPasswordValid) passwordRef.current?.focus(); //TODO
      else if (!curConfirmValid) confirmRef.current?.focus();
    }
  };

  const usernameHintShown = usernameFocus && (!!username || !!signUpErrorStatus) && !usernameValid;
  const passwordHintShown = passwordFocus && (!!password || !!signUpErrorStatus) && !passwordValid;
  const confirmHintShown = confirmFocus && (!!confirm || !!signUpErrorStatus) && !confirmValid;
  const usernameOccupied = signUpErrorStatus === 400 && usernameValid && passwordValid;

  return (
    <form className="RegistrationForm" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="usernameInput">Логин:</label>
        <input
          ref={usernameRef}
          id="usernameInput"
          type="text"
          autoFocus
          placeholder="Придумайте логин…"
          autoComplete="off"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          aria-describedby="usernameHint"
          aria-invalid={(!usernameValid || usernameOccupied) && !!username}
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
      </fieldset>
      <Tooltip
        id="usernameHint"
        shown={usernameHintShown && !usernameOccupied}
        anchorRef={usernameRef}
      >
        От 4 до 24 символов. Должен начинаться с буквы. Разрешены латинские буквы, цифры, дефисы и
        нижние подчёркивания.
      </Tooltip>
      <Tooltip id="usernameHint" shown={usernameOccupied} anchorRef={usernameRef}>
        Пользователь с таким именем уже существует
      </Tooltip>

      <fieldset>
        <label htmlFor="oldPasswordInput">Старый пароль:</label>
        <input
          ref={oldPasswordRef}
          id="oldPasswordInput"
          type="password"
          placeholder="Введите старый пароль…"
          autoComplete="off"
          required
          onChange={(e) => setOldPassword(e.target.value)}
          value={oldPassword}
          aria-describedby="oldPasswordHint"
          aria-invalid={!oldPasswordValid && !!oldPassword}
          onFocus={() => setOldPasswordFocus(true)}
          onBlur={() => setOldPasswordFocus(false)}
        />
      </fieldset>
      <Tooltip id="oldPasswordHint" shown={false} anchorRef={oldPasswordRef}>
        Пароль неверный.
      </Tooltip>

      <fieldset>
        <label htmlFor="passwordInput">Новый пароль:</label>
        <input
          ref={passwordRef}
          id="passwordInput"
          type="password"
          placeholder="Придумайте пароль…"
          autoComplete="off"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          aria-describedby="passwordHint"
          aria-invalid={!passwordValid && !!password}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
      </fieldset>
      <Tooltip id="passwordHint" shown={passwordHintShown} anchorRef={passwordRef}>
        От 8 до 24 символов. Должен включать заглавные и строчные латинские буквы, цифры и
        специальные символы. Разрешённые символы: <span aria-label="восклицательный знак">!</span>{' '}
        <span aria-label="собака">@</span> <span aria-label="решётка">#</span>{' '}
        <span aria-label="знак доллара">$</span> <span aria-label="процент">%</span>.
      </Tooltip>

      <fieldset>
        <label htmlFor="confirmInput">Подтвердите пароль:</label>
        <input
          ref={confirmRef}
          id="confirmInput"
          type="password"
          placeholder="Введите пароль ещё раз…"
          autoComplete="off"
          required
          onChange={(e) => setConfirm(e.target.value)}
          value={confirm}
          aria-describedby="confirmHint"
          aria-invalid={!confirmValid && !!confirm}
          onFocus={() => setConfirmFocus(true)}
          onBlur={() => setConfirmFocus(false)}
        />
      </fieldset>
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        Пароли не совпадают
      </Tooltip>

      <button ref={submitRef} type="submit">
        Сохранить изменения
      </button>
      <Tooltip shown={!!signUpErrorStatus && signUpErrorStatus !== 400} anchorRef={submitRef}>
        Ошибка изменения профиля
      </Tooltip>
    </form>
  );
};
export default EditUserForm;
