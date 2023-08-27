export type ApiErrorMessage =
  | 'unauthorized'
  | 'unknown'
  | 'invalidUsername'
  | 'invalidPassword'
  | 'usernameOccupied'
  | 'incorrectOldPassword';

export default class ApiError {
  message?: ApiErrorMessage;
  aborted: boolean = false;

  constructor(message?: ApiErrorMessage, aborted?: boolean) {
    if (message !== undefined) this.message = message;
    if (aborted !== undefined) this.aborted = aborted;
  }
}
