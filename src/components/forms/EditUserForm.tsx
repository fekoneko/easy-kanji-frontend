import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../overlays/Tooltip';
import usersApi, { EditedUserData } from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../animations/LoadingSpinner';
import { useTranslation } from 'react-i18next';
import useLoading from '../../hooks/useLoading';
import { Auth } from '../../contexts/authContext';

const USERNAME_REGEX = /^.{2,16}$/;
const PASSWORD_REGEX = /^.{6,24}$/;

type EditUserFormProps = {
  onSignedUp?: (e: FormEvent) => any;
};

const EditUserForm = ({ onSignedUp: onUserEdited }: EditUserFormProps) => {
  const { t } = useTranslation();
  const { auth } = useAuth();

  const [newUsername, setNewUsername] = useState<string>(auth?.username ?? '');
  const [newUsernameValid, setNewUsernameValid] = useState<boolean>(false);
  const [newUsernameFocus, setNewUsernameFocus] = useState<boolean>(false);

  const [oldPassword, setOldPassword] = useState<string>('');
  const [oldPasswordValid, setOldPasswordValid] = useState<boolean>(true);
  const [oldPasswordFocus, setOldPasswordFocus] = useState<boolean>(false);

  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordValid, setNewPasswordValid] = useState<boolean>(false);
  const [newPasswordFocus, setNewPasswordFocus] = useState<boolean>(false);

  const [confirm, setConfirm] = useState<string>('');
  const [confirmValid, setConfirmValid] = useState<boolean>(false);
  const [confirmFocus, setConfirmFocus] = useState<boolean>(false);

  const newUsernameRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const abortControllerRef = useAbortController();
  const [trackSubmit, submitStatus, submitError] = useLoading();
  const { showToast } = useToast();

  const validateNewUsername = (): boolean => !newUsername || USERNAME_REGEX.test(newUsername);
  const validateNewPassword = (): boolean => !newPassword || PASSWORD_REGEX.test(newPassword);
  const validateConfirm = (): boolean => !newPassword || confirm === newPassword;

  useEffect(() => {
    setNewUsernameValid(validateNewUsername());
  }, [newUsername]);

  useEffect(() => {
    setNewPasswordValid(validateNewPassword());
  }, [newPassword]);

  useEffect(() => {
    setOldPasswordValid(true);
  }, [oldPassword]);

  useEffect(() => {
    setConfirmValid(validateConfirm());
  }, [confirm, newPassword]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!auth) return;

    const curUsernameValid = validateNewUsername();
    const curPasswordValid = validateNewPassword();
    const curConfirmValid = validateConfirm();
    setNewUsernameValid(curUsernameValid);
    setNewPasswordValid(curPasswordValid);
    setConfirmValid(curConfirmValid);

    if (curUsernameValid && curPasswordValid && curConfirmValid) {
      const editedData: EditedUserData = {};
      if (newUsername && newUsername !== auth.username) editedData.username = newUsername;
      if (newPassword) editedData.password = newPassword;
      if (!editedData.username && !editedData.password) return;

      const [, status] = await trackSubmit(
        () =>
          usersApi.editUser(auth.id, oldPassword, editedData, abortControllerRef.current.signal),
        undefined,
        (error) => {
          if (error === 'unauthorized') {
            setOldPasswordValid(false);
            oldPasswordRef.current?.focus();
          } else if (error === 'usernameOccupied' || error === 'invalidUsername') {
            setNewUsernameValid(false);
            newUsernameRef.current?.focus();
          } else if (error === 'invalidPassword') {
            setNewPasswordValid(false);
            newPasswordRef.current?.focus();
          } else {
            showToast(t('Forms.EditUser.Errors.EditFailed'));
          }
        }
      );
      if (status === 'error') return;

      await trackSubmit(
        () =>
          usersApi.signIn(
            newUsername,
            !!newPassword ? newPassword : oldPassword,
            abortControllerRef.current.signal
          ),
        (newAuth) => {
          setAuth(newAuth as Auth);
          if (onUserEdited) onUserEdited(e);
        },
        () => {
          setAuth(null);
          showToast(t('Forms.SignIn.Errors.Unknown'));
        }
      );
    } else {
      if (!curUsernameValid) newUsernameRef.current?.focus();
      else if (!curPasswordValid) newPasswordRef.current?.focus();
      else if (!curConfirmValid) confirmRef.current?.focus();
    }
  };

  const newUsernameHintShown =
    newUsernameFocus && (!!newUsername || submitStatus === 'error') && !newUsernameValid;
  const oldPasswordHintShown = oldPasswordFocus && !oldPasswordValid;
  const newPasswordHintShown =
    newPasswordFocus && (!!newPassword || submitStatus === 'error') && !newPasswordValid;
  const confirmHintShown = confirmFocus && (!!confirm || submitStatus === 'error') && !confirmValid;

  return (
    <form
      className="my-4 grid gap-2 [grid-template-columns:minmax(0,0.4fr)_minmax(0,1.6fr)]"
      onSubmit={handleSubmit}
    >
      <label htmlFor="usernameInput">{t('Forms.EditUser.Username')}</label>
      <input
        ref={newUsernameRef}
        id="usernameInput"
        type="text"
        autoFocus
        placeholder={t('Forms.EditUser.UsernamePlaceholder')}
        autoComplete="off"
        onChange={(e) => setNewUsername(e.target.value)}
        value={newUsername}
        aria-describedby="usernameHint"
        aria-invalid={(!newUsernameValid || submitError === 'usernameOccupied') && !!newUsername}
        onFocus={() => setNewUsernameFocus(true)}
        onBlur={() => setNewUsernameFocus(false)}
      />
      <Tooltip
        id="usernameHint"
        shown={newUsernameHintShown && submitError !== 'usernameOccupied'}
        anchorRef={newUsernameRef}
      >
        {t('Forms.EditUser.Errors.UsernameHint')}
      </Tooltip>
      <Tooltip
        id="usernameHint"
        shown={submitError === 'usernameOccupied'}
        anchorRef={newUsernameRef}
      >
        {t('Forms.EditUser.Errors.UsernameOccupied')}
      </Tooltip>

      <label htmlFor="oldPasswordInput">{t('Forms.EditUser.OldPassword')}</label>
      <input
        ref={oldPasswordRef}
        id="oldPasswordInput"
        type="password"
        placeholder={t('Forms.EditUser.OldPasswordPlaceholder')}
        autoComplete="off"
        required
        onChange={(e) => setOldPassword(e.target.value)}
        value={oldPassword}
        aria-describedby="oldPasswordHint"
        aria-invalid={!oldPasswordValid && !!oldPassword}
        onFocus={() => setOldPasswordFocus(true)}
        onBlur={() => setOldPasswordFocus(false)}
      />
      <Tooltip id="oldPasswordHint" shown={oldPasswordHintShown} anchorRef={oldPasswordRef}>
        {t('Forms.EditUser.Errors.OldPasswordIncorrect')}
      </Tooltip>

      <label htmlFor="passwordInput">{t('Forms.EditUser.NewPassword')}</label>
      <input
        ref={newPasswordRef}
        id="passwordInput"
        type="password"
        placeholder={t('Forms.EditUser.NewPasswordPlaceholder')}
        autoComplete="off"
        onChange={(e) => setNewPassword(e.target.value)}
        value={newPassword}
        aria-describedby="passwordHint"
        aria-invalid={!newPasswordValid && !!newPassword}
        onFocus={() => setNewPasswordFocus(true)}
        onBlur={() => setNewPasswordFocus(false)}
      />
      <Tooltip id="passwordHint" shown={newPasswordHintShown} anchorRef={newPasswordRef}>
        {t('Forms.EditUser.Errors.NewPasswordHint')}
      </Tooltip>

      <label htmlFor="confirmInput">{t('Forms.EditUser.Confirm')}</label>
      <input
        ref={confirmRef}
        id="confirmInput"
        type="password"
        placeholder={t('Forms.EditUser.ConfirmPlaceholder')}
        autoComplete="off"
        required={!!newPassword}
        onChange={(e) => setConfirm(e.target.value)}
        value={confirm}
        aria-describedby="confirmHint"
        aria-invalid={!confirmValid && !!confirm}
        onFocus={() => setConfirmFocus(true)}
        onBlur={() => setConfirmFocus(false)}
      />
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        {t('Forms.EditUser.Errors.ConfirmHint')}
      </Tooltip>

      <button ref={submitRef} type="submit" className="col-span-2">
        {submitStatus === 'pending' ? <LoadingSpinner small /> : t('Forms.EditUser.Edit')}
      </button>
    </form>
  );
};
export default EditUserForm;
