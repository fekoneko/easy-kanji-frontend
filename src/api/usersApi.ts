import { Auth, Role } from '../contexts/authContext';
import { axiosInstance } from './axiosInstance';
import { Kanji } from '../contexts/kanjisContext';
import { parseServerKanjis, ServerKanji } from './kanjisApi';
import ApiError from './ApiError';
import { AxiosError } from 'axios';
import { setInLocalStorage } from '../controllers/localStorageController';

export type EditedUserData = {
  username?: string;
  password?: string;
  roles?: string[];
};

export type UserInfo = { id: number; username: string; roles: Role[]; savedKanjis: Kanji[] };

export default {
  async signIn(username: string, password: string, signal?: AbortSignal): Promise<Auth> {
    try {
      const response = await axiosInstance.post<Auth & { refreshToken: string }>(
        '/tokens/',
        { username, password },
        { signal, headers: { Authorization: '' } }
      );

      setInLocalStorage('_rt', response.data.refreshToken);

      return {
        id: response.data.id,
        username,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      if ((err as AxiosError).response?.status === 400) {
        if (
          ((err as AxiosError).response?.data as any)?.errors ===
          'Invalid credentials or refresh token.'
        )
          throw new ApiError('invalidUsername');
        if (((err as AxiosError).response?.data as any)?.errors === 'Password is incorrect.')
          throw new ApiError('invalidPassword');
      }
      throw new ApiError('unknown');
    }
  },

  async signUp(username: string, password: string, signal?: AbortSignal): Promise<Auth> {
    try {
      const response = await axiosInstance.post('/users/', { username, password }, { signal });
      return await this.signIn(response.data?.username ?? username, password, signal);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      if ((err as AxiosError).response?.status === 400) {
        if (((err as AxiosError).response?.data as any)?.errors === 'Such a user already exists.')
          throw new ApiError('usernameOccupied');
        if (((err as AxiosError).response?.data as any)?.errors?.Username)
          throw new ApiError('invalidUsername');
        if (((err as AxiosError).response?.data as any)?.errors?.Password)
          throw new ApiError('invalidPassword');
      }
      throw new ApiError('unknown');
    }
  },

  async editUser(
    userId: number,
    password: string,
    editedData: EditedUserData,
    signal?: AbortSignal
  ): Promise<void> {
    try {
      await axiosInstance.patch(
        `/users/${userId}`,
        { ...editedData, passwordCheck: password },
        { signal }
      );
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      if ((err as AxiosError).response?.status === 400) {
        if (
          ((err as AxiosError).response?.data as any)?.errors === 'This username is already taken.'
        )
          throw new ApiError('usernameOccupied');
        if (((err as AxiosError).response?.data as any)?.errors === 'Your password is incorrect.')
          throw new ApiError('incorrectOldPassword');
        if (
          ((err as AxiosError).response?.data as any)?.errors ===
          'Username length should be from 2 to 16.'
        )
          throw new ApiError('invalidUsername');
        if (
          ((err as AxiosError).response?.data as any)?.errors ===
          'Password length should be from 6 to 24.'
        )
          throw new ApiError('invalidPassword');
      }
      throw new ApiError('unknown');
    }
  },

  async getUserInfo(signal?: AbortSignal): Promise<UserInfo> {
    try {
      const response = await axiosInstance.get(`/users/me`, { signal });
      const serverKanjis: ServerKanji[] = response.data?.kanjis;
      return {
        id: response.data.id,
        username: response.data.username,
        roles: [response.data.role],
        savedKanjis: serverKanjis ? parseServerKanjis(serverKanjis) : [],
      };
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async saveKanjis(newKanjiIds: number[], signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.patch(`/users/kanjis/add`, newKanjiIds, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async removeKanjisFromSaved(removeKanjiIds: number[], signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.patch(`/users/kanjis/remove`, removeKanjiIds, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },
};
