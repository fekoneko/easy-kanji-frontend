import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../overlays/Tooltip';
import usersApi from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import useLoading from '../../hooks/useLoading';
import { Auth } from '../../contexts/authContext';

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
  const [trackSubmit, submitStatus] = useLoading();
  const abortControllerRef = useAbortController();
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setUsernameValid(true);
    setPasswordValid(true);
    trackSubmit(
      () => usersApi.signIn(username, password, abortControllerRef.current.signal),
      (newAuth) => {
        setAuth(newAuth as Auth);
        if (onLoggedIn) onLoggedIn(e);
      },
      (error) => {
        setAuth(null);

        if (error === 'invalidUsername') {
          setUsernameValid(false);
          setPasswordValid(true);
          usernameRef.current?.focus();
        } else if (error === 'invalidPassword') {
          setUsernameValid(true);
          setPasswordValid(false);
          passwordRef.current?.focus();
        } else {
          showToast(t('Forms.SignIn.Errors.Unknown'));
        }
      }
    );
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
        {submitStatus === 'pending' ? <LoadingSpinner small /> : t('Forms.SignIn.SignIn')}
      </button>
    </form>
  );
};
export default SignInForm;
