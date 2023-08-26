import { useEffect, useState } from 'react';
import ApiError, { ApiErrorMessage } from '../api/ApiError';

export type Status = 'pending' | 'done' | 'error' | 'aborted';
export type ApiFunction<T> = () => Promise<T>;
export type TrackStatusFunction<T> = (
  apiFunction: ApiFunction<T>,
  onDone?: (response: T) => any,
  onError?: (error: ApiErrorMessage | null) => any
) => Promise<[response: T | null, status: Status, error: ApiErrorMessage | null]>;

const useLoading = (): [
  trackStatus: TrackStatusFunction<unknown>,
  status: Status | null,
  error: ApiErrorMessage | null
] => {
  const [status, setStatus] = useState<Status | null>(null);
  const [error, setError] = useState<ApiErrorMessage | null>(null);

  useEffect(
    () => () => {
      setStatus(null);
      setError(null);
    },
    []
  );

  const trackStatus: TrackStatusFunction<unknown> = async (
    apiFunction: ApiFunction<unknown>,
    onDone?: (response: unknown) => any,
    onError?: (error: ApiErrorMessage | null) => any
  ) => {
    setStatus('pending');
    setError(null);
    try {
      const response = await apiFunction();
      setStatus('done');
      if (onDone) onDone(response);
      return [response, 'done', null];
    } catch (err: any) {
      if ((err as ApiError).aborted) return [null, 'aborted', null];

      setStatus('error');
      setError((err as ApiError)?.message ?? null);
      if (onError) onError((err as ApiError).message ?? null);
      return [null, 'error', (err as ApiError).message ?? null];
    }
  };

  return [trackStatus, status, error];
};
export default useLoading;
