import { Auth } from '../contexts/authContext';
import { axiosInstance } from './axiosInstance';
import { Kanji } from '../contexts/kanjiContext';
import { parseServerKanjis, ServerKanji } from './kanjisApi';
import ApiError from './ApiError';
import { AxiosError } from 'axios';

export type EditedUserData = {
  username?: string;
  password?: string;
  roles?: string[];
};

export default {
  async signIn(username: string, password: string, signal?: AbortSignal): Promise<Auth> {
    try {
      const response = await axiosInstance.post<Auth>(
        '/tokens/',
        { username, password },
        { signal }
      );

      return {
        id: response.data.id,
        username,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async signUp(username: string, password: string, signal?: AbortSignal): Promise<Auth> {
    try {
      const response = await axiosInstance.post('/users/', { username, password }, { signal });
      return await this.signIn(response.data?.username ?? username, password, signal);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
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
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async getSavedKanjis(signal?: AbortSignal): Promise<Kanji[]> {
    try {
      const response = await axiosInstance.get(`/users/me`, { signal });
      const serverKanjis: ServerKanji[] = response.data?.kanjis;
      return serverKanjis ? parseServerKanjis(serverKanjis) : [];
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async saveKanjis(newKanjiIds: number[], signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.patch(`/users/kanjis/add`, newKanjiIds, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async removeKanjisFromSaved(removeKanjiIds: number[], signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.patch(`/users/kanjis/remove`, removeKanjiIds, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 408) throw new ApiError('network');
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },
};
