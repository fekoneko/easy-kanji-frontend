import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';
import { axiosPrivate, axiosPublic } from './axios';
import { AxiosInstance } from 'axios';

export type KanjiListName = 'popular';
export type ResponseKanji = {
  id: number;
  writing: string;
  meaning: string;
  onReadings: string;
  kunReadings: string;
};

export const parseKanji = (responseKanji: ResponseKanji | null): Kanji | null => {
  if (!responseKanji) return null;
  return {
    ...responseKanji,
    onReadings: responseKanji.onReadings.split(','),
    kunReadings: responseKanji.kunReadings.split(','),
  };
};

export const parseKanjis = (responseKanjis: ResponseKanji[] | null): Kanji[] | null => {
  if (!responseKanjis) return null;
  return responseKanjis.map((responseKanji) => parseKanji(responseKanji)!);
};

export default {
  async getKanjiById(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji | null> {
    const responseKanji = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPublic).get<ResponseKanji>(`/kanjis/${kanjiId}`),
      setErrorStatus
    );
    return parseKanji(responseKanji);
  },

  async getKanjisByIds(
    kanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const responseKanjis = await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPublic).get<ResponseKanji[]>(`/kanjis/`, { params: { kanjiIds } }),
      setErrorStatus
    );
    return parseKanjis(responseKanjis);
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const responseKanjis = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPublic).get<ResponseKanji[]>(`/kanjis/${listName}`),
      setErrorStatus
    );
    return parseKanjis(responseKanjis);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const responseKanjis = await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPublic).get<ResponseKanji[]>(`/kanjis/${listName}`, {
          params: { s: startIndex, e: endIndex },
        }),
      setErrorStatus
    );
    return parseKanjis(responseKanjis);
  },

  async searchKanjis(
    request: string,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const responseKanjis = await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPublic).get<ResponseKanji[]>('/kanjis/search', {
          params: { s: request },
        }),
      setErrorStatus
    );
    return parseKanjis(responseKanjis);
  },

  async addKanji(
    listName: KanjiListName,
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).post(`/kanjis/${listName}`, newKanji),
      setErrorStatus
    );
  },

  async editKanji(
    id: number,
    editedKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).put(`/kanjis/${id}`, editedKanji),
      setErrorStatus
    );
  },

  async deleteKanji(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () => (axiosInstance ?? axiosPrivate).delete(`/kanjis/${kanjiId}`),
      setErrorStatus
    );
  },
};
