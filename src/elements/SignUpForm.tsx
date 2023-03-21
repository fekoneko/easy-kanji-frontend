import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from './Tooltip';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const SignUpForm = () => {
  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<string>('');
  const [confirmValid, setConfirmValid] = useState<boolean>(false);
  const [confirmFocus, setConfirmFocus] = useState<boolean>(false);
  const [showFirstHint, setShowFirstHint] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const validateUsername = (): boolean => USERNAME_REGEX.test(username);
  const validatePassword = (): boolean => PASSWORD_REGEX.test(password);
  const validateConfirm = (): boolean => confirm === password;

  useEffect(() => setUsernameValid(validateUsername()), [username]);
  useEffect(() => setPasswordValid(validatePassword()), [password]);
  useEffect(() => setConfirmValid(validateConfirm()), [confirm, password]);

  useEffect(() => setShowFirstHint(false), [usernameFocus, passwordFocus, confirmFocus]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const curUsernameValid = validateUsername();
    const curPasswordValid = validatePassword();
    const curConfirmValid = validateConfirm();
    setUsernameValid(curUsernameValid);
    setPasswordValid(curPasswordValid);
    setConfirmValid(curConfirmValid);
    if (curUsernameValid && curPasswordValid && curConfirmValid) {
      // TODO
    } else {
      setShowFirstHint(true);
      // TODO
    }
  };

  let usernameHintShown = false;
  let passwordHintShown = false;
  let confirmHintShown = false;
  if (showFirstHint) {
    if (!usernameValid) {
      usernameHintShown = true;
    } else if (!passwordValid) {
      passwordHintShown = true;
    } else if (!confirmValid) {
      confirmHintShown = true;
    }
  } else {
    usernameHintShown = usernameFocus && !!username && !usernameValid;
    passwordHintShown = passwordFocus && !!password && !passwordValid;
    confirmHintShown = confirmFocus && !!confirm && !confirmValid;
  }

  return (
    <form className="RegistrationForm styledForm" onSubmit={handleSubmit}>
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
          aria-invalid={usernameValid || !username ? 'false' : 'true'}
          onFocus={() => setUsernameFocus(true)}
          onBlur={() => setUsernameFocus(false)}
        />
      </fieldset>
      <Tooltip id="usernameHint" shown={usernameHintShown} anchorRef={usernameRef}>
        От 4 до 24 символов. Должен начинаться с буквы. Разрешены латинские буквы, цифры, дефисы и
        нижние подчёркивания.
      </Tooltip>

      <fieldset>
        <label htmlFor="passwordInput">Пароль:</label>
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
          aria-invalid={passwordValid || !password ? 'false' : 'true'}
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
          aria-invalid={confirmValid || !confirm ? 'false' : 'true'}
          onFocus={() => setConfirmFocus(true)}
          onBlur={() => setConfirmFocus(false)}
        />
      </fieldset>
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        Пароли не совпадают
      </Tooltip>

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};
export default SignUpForm;
