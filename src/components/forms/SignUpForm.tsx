import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../overlays/Tooltip';
import usersApi from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';

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
  const [loading, setLoading] = useState(false);
  const [signUpErrorStatus, setSignUpErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();
  const { showPopup } = usePopup();

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
    if (!signUpErrorStatus) return;

    if (signUpErrorStatus === 400) {
      usernameRef.current?.focus();
    } else {
      showPopup(t('Forms.SignUp.Errors.Unknown'));
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
      const newAuth = await usersApi.signUp(
        username,
        password,
        setSignUpErrorStatus,
        undefined,
        setLoading,
        setLoading,
        abortControllerRef.current.signal
      );
      if (!newAuth) return;
      setAuth(newAuth);
      if (onSignedUp) onSignedUp(e);
    } else {
      if (!curUsernameValid) usernameRef.current?.focus();
      else if (!curPasswordValid) passwordRef.current?.focus();
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
        {t('Forms.SignUp.Errors.UsernameHint')}
      </Tooltip>
      <Tooltip id="usernameHint" shown={usernameOccupied} anchorRef={usernameRef}>
        {t('Forms.SignUp.Errors.UsernameOccupied')}
      </Tooltip>

      <fieldset>
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
      </fieldset>
      <Tooltip id="passwordHint" shown={passwordHintShown} anchorRef={passwordRef}>
        {t('Forms.SignUp.Errors.PasswordHint')}
      </Tooltip>

      <fieldset>
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
      </fieldset>
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        {t('Forms.SignUp.Errors.ConfirmHint')}
      </Tooltip>

      <button ref={submitRef} type="submit">
        {loading ? <LoadingSpinner /> : t('Forms.SignUp.SignUp')}
      </button>
    </form>
  );
};
export default SignUpForm;
