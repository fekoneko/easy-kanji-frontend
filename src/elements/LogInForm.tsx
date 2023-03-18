import { FormEvent, useContext, useEffect, useState } from 'react';

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
        <input
          id="usernameInput"
          type="text"
          autoFocus
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
      <p
        className={
          'inputHint' +
          ((showAllHints || usernameFocus) && username && !usernameValid ? '' : ' hidden')
        }
        id="usernameHint"
      ></p>

      <fieldset>
        <input
          id="passwordInput"
          type="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          aria-describedby="passwordHint"
          aria-invalid={passwordValid || !password ? 'false' : 'true'}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
        />
      </fieldset>
      <p
        className={
          'inputHint' +
          ((showAllHints || passwordFocus) && password && !passwordValid ? '' : ' hidden')
        }
        id="passwordHint"
      ></p>
    </form>
  );
};
export default LogInForm;
