export type ApiErrorMessage =
  | 'network'
  | 'unauthorized'
  | 'unknown'
  | 'kanjiAlreadyExists'
  | 'kanjiNotFound'
  | 'invalidUsername'
  | 'invalidPassword'
  | 'usernameOccupied'
  | 'userNotFound';

export default class ApiError {
  message?: ApiErrorMessage;
  aborted: boolean = false;

  constructor(message?: ApiErrorMessage, aborted?: boolean) {
    if (message !== undefined) this.message = message;
    if (aborted !== undefined) this.aborted = aborted;
  }
}
