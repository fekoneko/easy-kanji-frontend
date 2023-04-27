import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Auth } from '../contexts/authContext';
import { axiosPrivate } from './axios';
import { Kanji } from '../contexts/kanjiContext';
import { parseServerKanjis, ServerKanji } from './kanjisApi';

export default {
  async signIn(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Auth | null> {
    const responceData = await catchAxiosErrors<Partial<Auth>>(
      () => axiosPrivate.post('/tokens/', { username, password }, { signal }),
      setErrorStatus
    );
    if (typeof responceData?.roles === 'object' && typeof responceData?.accessToken === 'string') {
      return {
        username,
        roles: responceData.roles,
        accessToken: responceData.accessToken,
      };
    } else return null;
  },

  async signUp(
    username: string,
    password: string,
    setRegErrorStatus?: SetErrorStatus,
    setLogErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Auth | null> {
    const regResponceData = await catchAxiosErrors<Partial<Auth>>(
      () => axiosPrivate.post('/users/', { username, password }, { signal }),
      setRegErrorStatus
    );
    if (!regResponceData) return null;

    const logResponceData = await this.signIn(username, password, setLogErrorStatus);
    if (
      typeof logResponceData?.roles === 'object' &&
      typeof logResponceData?.accessToken === 'string'
    ) {
      return {
        username,
        roles: logResponceData.roles,
        accessToken: logResponceData.accessToken,
      };
    } else return null;
  },

  async getSavedKanjis(
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const response = await catchAxiosErrors(
      () => axiosPrivate.get(`/users/me`, { signal }),
      setErrorStatus
    );
    const serverKanjis: ServerKanji[] = response?.kanjis;
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async saveKanjis(
    newKanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<any> {
    return await catchAxiosErrors(
      () => axiosPrivate.patch(`/users/kanji/add`, newKanjiIds, { signal }),
      setErrorStatus
    );
  },

  async removeKanjisFromSaved(
    removeKanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<any> {
    return await catchAxiosErrors(
      () => axiosPrivate.patch(`/users/kanji/remove`, removeKanjiIds, { signal }),
      setErrorStatus
    );
  },
};
