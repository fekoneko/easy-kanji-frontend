import { FormEvent, useEffect, useRef, useState } from 'react';
import Tooltip from '../content/Tooltip';
import usersApi, { EditedUserData } from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

type EditUserFormProps = {
  onSignedUp?: (e: FormEvent) => any;
};

const EditUserForm = ({ onSignedUp: onUserEdited }: EditUserFormProps) => {
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
  const [editUserErrorStatus, setEditUserErrorStatus] = useState<number | null>(null);

  const usernameRef = useRef<HTMLInputElement>(null);
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const { setAuth } = useAuth();
  const abortControllerRef = useAbortController();
  const { showPopup } = usePopup();

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
    setConfirmValid(validateConfirm());
  }, [confirm, newPassword]);

  useEffect(() => {
    setEditUserErrorStatus(null);
  }, [newUsername, newPassword, confirm]);

  useEffect(() => {
    if (!editUserErrorStatus) return;

    if (editUserErrorStatus === 400) {
      usernameRef.current?.focus();
    } else {
      showPopup('При сохранении возникла ошибка');
    }
  }, [editUserErrorStatus]);

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

      const userEditSuccess = await usersApi.editUser(
        auth.id,
        oldPassword,
        editedData,
        setEditUserErrorStatus,
        abortControllerRef.current.signal
      );
      if (!userEditSuccess) return;
      // TODO: handle wrong old password error

      const newAuth = await usersApi.signIn(
        newUsername,
        !!newPassword ? newPassword : oldPassword,
        undefined,
        abortControllerRef.current.signal
      );
      setAuth(newAuth);

      if (onUserEdited) onUserEdited(e);
    } else {
      if (!curUsernameValid) usernameRef.current?.focus();
      else if (!curPasswordValid) passwordRef.current?.focus();
      else if (!curConfirmValid) confirmRef.current?.focus();
    }
  };

  const usernameHintShown =
    newUsernameFocus && (!!newUsername || !!editUserErrorStatus) && !newUsernameValid;
  const oldPasswordHintShown = oldPasswordFocus && !oldPasswordValid;
  const passwordHintShown =
    newPasswordFocus && (!!newPassword || !!editUserErrorStatus) && !newPasswordValid;
  const confirmHintShown = confirmFocus && (!!confirm || !!editUserErrorStatus) && !confirmValid;
  const usernameOccupied = !!newUsername && editUserErrorStatus === 400 && newUsernameValid;

  return (
    <form className="RegistrationForm" onSubmit={handleSubmit}>
      <fieldset>
        <label htmlFor="usernameInput">Логин:</label>
        <input
          ref={usernameRef}
          id="usernameInput"
          type="text"
          autoFocus
          placeholder="Придумайте логин…"
          autoComplete="off"
          onChange={(e) => setNewUsername(e.target.value)}
          value={newUsername}
          aria-describedby="usernameHint"
          aria-invalid={(!newUsernameValid || usernameOccupied) && !!newUsername}
          onFocus={() => setNewUsernameFocus(true)}
          onBlur={() => setNewUsernameFocus(false)}
        />
      </fieldset>
      <Tooltip
        id="usernameHint"
        shown={usernameHintShown && !usernameOccupied}
        anchorRef={usernameRef}
      >
        От 4 до 24 символов. Должен начинаться с буквы. Разрешены латинские буквы, цифры, дефисы и
        нижние подчёркивания.
      </Tooltip>
      <Tooltip id="usernameHint" shown={usernameOccupied} anchorRef={usernameRef}>
        Пользователь с таким именем уже существует
      </Tooltip>

      <fieldset>
        <label htmlFor="oldPasswordInput">Старый пароль:</label>
        <input
          ref={oldPasswordRef}
          id="oldPasswordInput"
          type="password"
          placeholder="Введите старый пароль…"
          autoComplete="off"
          required
          onChange={(e) => setOldPassword(e.target.value)}
          value={oldPassword}
          aria-describedby="oldPasswordHint"
          aria-invalid={!oldPasswordValid && !!oldPassword}
          onFocus={() => setOldPasswordFocus(true)}
          onBlur={() => setOldPasswordFocus(false)}
        />
      </fieldset>
      <Tooltip id="oldPasswordHint" shown={oldPasswordHintShown} anchorRef={oldPasswordRef}>
        Пароль неверный.
      </Tooltip>

      <fieldset>
        <label htmlFor="passwordInput">Новый пароль:</label>
        <input
          ref={passwordRef}
          id="passwordInput"
          type="password"
          placeholder="Придумайте пароль…"
          autoComplete="off"
          onChange={(e) => setNewPassword(e.target.value)}
          value={newPassword}
          aria-describedby="passwordHint"
          aria-invalid={!newPasswordValid && !!newPassword}
          onFocus={() => setNewPasswordFocus(true)}
          onBlur={() => setNewPasswordFocus(false)}
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
          required={!!newPassword}
          onChange={(e) => setConfirm(e.target.value)}
          value={confirm}
          aria-describedby="confirmHint"
          aria-invalid={!confirmValid && !!confirm}
          onFocus={() => setConfirmFocus(true)}
          onBlur={() => setConfirmFocus(false)}
        />
      </fieldset>
      <Tooltip id="confirmHint" shown={confirmHintShown} anchorRef={confirmRef}>
        Пароли не совпадают
      </Tooltip>

      <button ref={submitRef} type="submit">
        Сохранить изменения
      </button>
    </form>
  );
};
export default EditUserForm;
