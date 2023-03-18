import { FormEvent, useEffect, useState } from 'react';

const LogInForm = () => {
  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [showAllHints, setShowAllHints] = useState<boolean>(false);

  useEffect(() => {
    if (!usernameValid) setUsernameValid(true); // will be actually checked on submit
  }, [username]);

  useEffect(() => {
    if (!passwordValid) setPasswordValid(true); // will be actually checked on submit
  }, [password]);

  useEffect(() => setShowAllHints(false), [usernameFocus, passwordFocus]);

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
      setShowAllHints(true);
      // TODO
    }
  };

  return (
    <form className="LogInForm styledForm" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="usernameInput">Логин:</label>
        <input
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

      {(showAllHints || usernameFocus) && username && !usernameValid ? (
        <p className="inputHint" id="usernameHint">
          Пользователя с таким именем не существует
        </p>
      ) : (
        <></>
      )}

      <fieldset>
        <label htmlFor="passwordInput">Пароль:</label>
        <input
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

      {(showAllHints || passwordFocus) && password && !passwordValid ? (
        <p className="inputHint" id="passwordHint">
          Пароль введён неверно
        </p>
      ) : (
        <></>
      )}

      <button type="submit">Войти</button>
    </form>
  );
};
export default LogInForm;
