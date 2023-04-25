import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Auth } from '../contexts/authContext';
import { axiosPrivate } from './axios';
import { AxiosInstance } from 'axios';
import { Kanji } from '../contexts/kanjiContext';
import { parseKanjis, ResponseKanji } from './kanjisApi';

export default {
  async signIn(
    username: string,
    password: string,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Auth | null> {
    const responceData = await catchAxiosErrors<Partial<Auth>>(
      () => (axiosInstance ?? axiosPrivate).post('/tokens/', { username, password }),
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
    axiosInstance?: AxiosInstance
  ): Promise<Auth | null> {
    const regResponceData = await catchAxiosErrors<Partial<Auth>>(
      () => (axiosInstance ?? axiosPrivate).post('/users/', { username, password }),
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
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const responseKanjis = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).get<ResponseKanji[]>(`/users/kanjis`),
      setErrorStatus
    );
    return parseKanjis(responseKanjis);
  },

  async saveKanji(
    newKanjiId: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).patch(`/users/kanji/add`, newKanjiId),
      setErrorStatus
    );
  },

  async removeKanjiFromSaved(
    removeKanjiId: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).patch(`/users/kanji/remove`, removeKanjiId),
      setErrorStatus
    );
  },
};
