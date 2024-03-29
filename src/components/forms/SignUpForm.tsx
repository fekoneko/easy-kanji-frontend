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

const USERNAME_REGEX = /^.{2,16}$/;
const PASSWORD_REGEX = /^.{6,24}$/;

type SignUpFormProps = {
  onSignedUp?: (e: FormEvent) => any;
};

const SignUpForm = ({ onSignedUp }: SignUpFormProps) => {
  const { t } = useTranslation();

  const [username, setUsername] = useState<string>('');
  const [usernameValid, setUsernameValid] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordValid, setPasswordValid] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<string>('');
  const [confirmValid, setConfirmValid] = useState<boolean>(false);
  const [confirmFocus, setConfirmFocus] = useState<boolean>(false);

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const [trackSubmit, submitStatus, submitError] = useLoading();
  const abortControllerRef = useAbortController();
  const { showToast } = useToast();

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const curUsernameValid = validateUsername();
    const curPasswordValid = validatePassword();
    const curConfirmValid = validateConfirm();
    setUsernameValid(curUsernameValid);
    setPasswordValid(curPasswordValid);
    setConfirmValid(curConfirmValid);
    if (curUsernameValid && curPasswordValid && curConfirmValid) {
      trackSubmit(
        () => usersApi.signUp(username, password, abortControllerRef.current.signal),
        (newAuth) => {
          setAuth(newAuth as Auth);
          if (onSignedUp) onSignedUp(e);
        },
        (error) => {
          setAuth(null);

          if (error === 'usernameOccupied') {
            setUsernameValid(false);
            usernameRef.current?.focus();
          } else if (error === 'invalidUsername') {
            setUsernameValid(false);
            usernameRef.current?.focus();
          } else if (error === 'invalidPassword') {
            setPasswordValid(false);
            passwordRef.current?.focus();
          } else {
            showToast(t('Forms.SignUp.Errors.Unknown'));
          }
        }
      );
    } else {
      if (!curUsernameValid) usernameRef.current?.focus();
      else if (!curPasswordValid) passwordRef.current?.focus();
      else if (!curConfirmValid) confirmRef.current?.focus();
    }
  };

  const usernameHintShown =
    usernameFocus && (!!username || submitStatus === 'error') && !usernameValid;
  const passwordHintShown =
    passwordFocus && (!!password || submitStatus === 'error') && !passwordValid;
  const confirmHintShown = confirmFocus && (!!confirm || submitStatus === 'error') && !confirmValid;

  return (
    <form
      className="my-4 grid gap-2 [grid-template-columns:minmax(0,0.6fr)_minmax(0,1.4fr)]"
      onSubmit={handleSubmit}
    >
      <label htmlFor="usernameInput">{t('Forms.SignUp.Username')}</label>
      <input
        ref={usernameRef}
        id="usernameInput"
        type="text"
        autoFocus
        placeholder={t('Forms.SignUp.UsernamePlaceholder')}
        autoComplete="off"
        required
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        aria-describedby="usernameHint"
        aria-invalid={(!usernameValid || submitError === 'usernameOccupied') && !!username}
        onFocus={() => setUsernameFocus(true)}
        onBlur={() => setUsernameFocus(false)}
      />
      <Tooltip
        id="usernameHint"
        shown={usernameHintShown && submitError !== 'usernameOccupied'}
        anchorRef={usernameRef}
      >
        {t('Forms.SignUp.Errors.UsernameHint')}
      </Tooltip>
      <Tooltip id="usernameHint" shown={submitError === 'usernameOccupied'} anchorRef={usernameRef}>
        {t('Forms.SignUp.Errors.UsernameOccupied')}
      </Tooltip>

      <label htmlFor="passwordInput">{t('Forms.SignUp.Password')}</label>
      <input
        ref={passwordRef}
        id="passwordInput"
        type="password"
        placeholder={t('Forms.SignUp.PasswordPlaceholder')}
        autoComplete="off"
        required
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        aria-describedby="passwordHint"
        aria-invalid={!passwordValid && !!password}
        onFocus={() => setPasswordFocus(true)}
        onBlur={() => setPasswordFocus(false)}
      />
      <Tooltip id="passwordHint" shown={passwordHintShown} anchorRef={passwordRef}>
        {t('Forms.SignUp.Errors.PasswordHint')}
      </Tooltip>

      <label htmlFor="confirmInput">{t('Forms.SignUp.Confirm')}</label>
      <input
        ref={confirmRef}
        id="confirmInput"
        type="password"
        placeholder={t('Forms.SignUp.ConfirmPlaceholder')}
        autoComplete="off"
        required
        onChange={(e) => setConfirm(e.target.value)}
        value={confirm}
        aria-describedby="confirmHint"
        aria-invalid={!confirmValid && !!confirm}
        onFocus={() => setConfirmFocus(true)}
        onBlur={() => setConfirmFocus(false)}
      />
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        {t('Forms.SignUp.Errors.ConfirmHint')}
      </Tooltip>

      <button ref={submitRef} type="submit" className="col-span-2">
        {submitStatus === 'pending' ? <LoadingSpinner small /> : t('Forms.SignUp.SignUp')}
      </button>
    </form>
  );
};
export default SignUpForm;
