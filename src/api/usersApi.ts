import { catchAxiosErrors, SetErrorStatus, SetLoading } from '../controllers/axiosController';
import { Auth } from '../contexts/authContext';
import { axiosInstance } from './axiosInstance';
import { Kanji } from '../contexts/kanjiContext';
import { parseServerKanjis, ServerKanji } from './kanjisApi';

export type EditedUserData = {
  username?: string;
  password?: string;
  roles?: string[];
};

export default {
  async signIn(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Auth | null> {
    const [responseData] = await catchAxiosErrors<Partial<Auth>>(
      () => axiosInstance.post('/tokens/', { username, password }, { signal }),
      setErrorStatus,
      setLoading
    );
    if (
      typeof responseData?.id !== 'number' ||
      typeof responseData?.roles !== 'object' ||
      typeof responseData?.accessToken !== 'string'
    ) {
      return null;
    }
    return {
      id: responseData.id,
      username,
      roles: responseData.roles,
      accessToken: responseData.accessToken,
    };
  },

  async signUp(
    username: string,
    password: string,
    setRegErrorStatus?: SetErrorStatus,
    setLogErrorStatus?: SetErrorStatus,
    setRegLoading?: SetLoading,
    setLogLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Auth | null> {
    const [responseData, errorStatus] = await catchAxiosErrors<Partial<Auth>>(
      () => axiosInstance.post('/users/', { username, password }, { signal }),
      setRegErrorStatus,
      setRegLoading
    );
    if (errorStatus) return null;
    return await this.signIn(
      responseData?.username ?? username,
      password,
      setLogErrorStatus,
      setLogLoading
    );
  },

  async editUser(
    userId: number,
    password: string,
    editedData: EditedUserData,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const [, errorStatus] = await catchAxiosErrors(
      () =>
        axiosInstance.patch(
          `/users/${userId}`,
          { ...editedData, passwordCheck: password },
          { signal }
        ),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },

  async getSavedKanjis(
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [responseData] = await catchAxiosErrors(
      () => axiosInstance.get(`/users/me`, { signal }),
      setErrorStatus,
      setLoading
    );
    const serverKanjis: ServerKanji[] = responseData?.kanjis;
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async saveKanjis(
    newKanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosInstance.patch(`/users/kanjis/add`, newKanjiIds, { signal }),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },

  async removeKanjisFromSaved(
    removeKanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosInstance.patch(`/users/kanjis/remove`, removeKanjiIds, { signal }),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },
};
