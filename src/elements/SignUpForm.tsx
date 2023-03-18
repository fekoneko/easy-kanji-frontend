import { FormEvent, useEffect, useState } from 'react';

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
  const [showAllHints, setShowAllHints] = useState<boolean>(false);

  const validateUsername = (): boolean => USERNAME_REGEX.test(username);
  const validatePassword = (): boolean => PASSWORD_REGEX.test(password);
  const validateConfirm = (): boolean => confirm === password;

  useEffect(() => setUsernameValid(validateUsername()), [username]);
  useEffect(() => setPasswordValid(validatePassword()), [password]);
  useEffect(() => setConfirmValid(validateConfirm()), [confirm, password]);

  useEffect(() => setShowAllHints(false), [usernameFocus, passwordFocus, confirmFocus]);

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
      setShowAllHints(true);
      // TODO
    }
  };

  return (
    <form className="RegistrationForm styledForm" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="usernameInput">Логин:</label>
        <input
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
      {(showAllHints || usernameFocus) && username && !usernameValid ? (
        <p className="inputHint" id="usernameHint">
          От 4 до 24 символов. Должен начинаться с буквы. Разрешены латинские буквы, цифры, дефисы и
          нижние подчёркивания.
        </p>
      ) : (
        <></>
      )}

      <fieldset>
        <label htmlFor="passwordInput">Пароль:</label>
        <input
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
      {(showAllHints || passwordFocus) && password && !passwordValid ? (
        <p className="inputHint" id="passwordHint">
          От 8 до 24 символов. Должен включать заглавные и строчные латинские буквы, цифры и
          специальные символы. Разрешённые символы: <span aria-label="восклицательный знак">!</span>{' '}
          <span aria-label="собака">@</span> <span aria-label="решётка">#</span>{' '}
          <span aria-label="знак доллара">$</span> <span aria-label="процент">%</span>.
        </p>
      ) : (
        <></>
      )}

      <fieldset>
        <label htmlFor="confirmInput">Подтвердите пароль:</label>
        <input
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
      {(showAllHints || confirmFocus) && confirm && !confirmValid ? (
        <p className="inputHint" id="confirmHint">
          Пароли не совпадают
        </p>
      ) : (
        <></>
      )}

      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};
export default SignUpForm;
