import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from './Tooltip';

const LogInForm = () => {
  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [showFirstHint, setShowFirstHint] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!usernameValid) setUsernameValid(true); // will be actually checked on submit
  }, [username]);

  useEffect(() => {
    if (!passwordValid) setPasswordValid(true); // will be actually checked on submit
  }, [password]);

  useEffect(() => setShowFirstHint(false), [usernameFocus, passwordFocus]);

  const validateForm = async (): Promise<[usernameValid: boolean, passwordValid: boolean]> => {
    // TODO check on server
    return [false, false];
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const [curUsernameValid, curPasswordValid] = await validateForm();
    setUsernameValid(curUsernameValid);
    setPasswordValid(curPasswordValid);
    if (curUsernameValid && curPasswordValid) {
      // TODO
    } else {
      setShowFirstHint(true);
      // TODO
    }
  };

  let usernameHintShown = false;
  let passwordHintShown = false;
  if (showFirstHint) {
    if (!usernameValid) {
      usernameHintShown = true;
    } else if (!passwordValid) {
      passwordHintShown = true;
    }
  } else {
    usernameHintShown = usernameFocus && !!username && !usernameValid;
    passwordHintShown = passwordFocus && !!password && !passwordValid;
  }

  return (
    <form className="LogInForm styledForm" onSubmit={handleSubmit}>
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
      <Tooltip id="usernameHint" shown={usernameHintShown} anchorRef={usernameRef}>
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
      <Tooltip id="passwordHint" shown={passwordHintShown} anchorRef={passwordRef}>
        Пароль введён неверно
      </Tooltip>

      <button type="submit">Войти</button>
    </form>
  );
};
export default LogInForm;
