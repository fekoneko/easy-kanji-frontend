import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../overlays/Tooltip';
import usersApi from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';

type SignInFormProps = {
  onLoggedIn?: (e: FormEvent) => any;
};

const SignInForm = ({ onLoggedIn }: SignInFormProps) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(true);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(true);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [signInErrorStatus, setSignInErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();
  const { showPopup } = useToast();

  useEffect(() => {
    if (signInErrorStatus) setSignInErrorStatus(null);
  }, [username, password]);

  useEffect(() => {
    if (!signInErrorStatus) return;

    if (signInErrorStatus === 404) {
      setUsernameValid(false);
      setPasswordValid(true);
      usernameRef.current?.focus();
    } else if (signInErrorStatus === 400) {
      setUsernameValid(true);
      setPasswordValid(false);
      passwordRef.current?.focus();
    } else {
      showPopup(t('Forms.SignIn.Errors.Unknown'));
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
      setLoading,
      abortControllerRef.current.signal
    );
    if (!newAuth) return;
    setAuth(newAuth);
    if (onLoggedIn) onLoggedIn(e);
  };

  return (
    <form
      className="my-4 grid gap-2 [grid-template-columns:minmax(0,0.6fr)_minmax(0,1.4fr)]"
      onSubmit={handleSubmit}
    >
      <label htmlFor="usernameInput">{t('Forms.SignIn.Username')}</label>
      <input
        ref={usernameRef}
        id="usernameInput"
        type="text"
        autoFocus
        placeholder={t('Forms.SignIn.UsernamePlaceholder')}
        autoComplete="off"
        required
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        aria-describedby="usernameHint"
        aria-invalid={usernameValid || !username ? 'false' : 'true'}
        onFocus={() => setUsernameFocus(true)}
        onBlur={() => setUsernameFocus(false)}
      />
      <Tooltip id="usernameHint" shown={!usernameValid && usernameFocus} anchorRef={usernameRef}>
        {t('Forms.SignIn.Errors.UsernameDoesNotExist')}
      </Tooltip>

      <label htmlFor="passwordInput">{t('Forms.SignIn.Password')}</label>
      <input
        ref={passwordRef}
        id="passwordInput"
        type="password"
        placeholder={t('Forms.SignIn.PasswordPlaceholder')}
        required
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        aria-describedby="passwordHint"
        aria-invalid={passwordValid || !password ? 'false' : 'true'}
        onFocus={() => setPasswordFocus(true)}
        onBlur={() => setPasswordFocus(false)}
      />
      <Tooltip id="passwordHint" shown={!passwordValid && passwordFocus} anchorRef={passwordRef}>
        {t('Forms.SignIn.Errors.PasswordIncorrect')}
      </Tooltip>

      <button ref={submitRef} type="submit" className="col-span-2">
        {loading ? <LoadingSpinner small /> : t('Forms.SignIn.SignIn')}
      </button>
    </form>
  );
};
export default SignInForm;
