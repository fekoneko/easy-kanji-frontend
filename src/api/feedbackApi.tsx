import { AxiosError } from 'axios';
import ApiError from './ApiError';
import { axiosInstance } from './axiosInstance';

export default {
  async send(body: string, username?: string, email?: string, signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.post('/feedback/', { username, body, email }, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },
};
