import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';
import { axiosPrivate, axiosPublic } from './axios';
import { AxiosInstance } from 'axios';

export type KanjiListName = 'popular';
export type ServerKanji = {
  id: number;
  writing: string;
  meaning: string;
  onReadings: string;
  kunReadings: string;
};

export const parseServerKanji = (serverKanji: ServerKanji): Kanji => ({
  ...serverKanji,
  onReadings: serverKanji.onReadings.split(','),
  kunReadings: serverKanji.kunReadings.split(','),
});

export const parseServerKanjis = (serverKanjis: ServerKanji[]): Kanji[] =>
  serverKanjis.map((serverKanji) => parseServerKanji(serverKanji));

export const formatKanjiForServer = (kanji: Kanji): ServerKanji => ({
  ...kanji,
  onReadings: kanji.onReadings.join(','),
  kunReadings: kanji.kunReadings.join(','),
});

export const formatKanjisForServer = (kanjis: Kanji[]): ServerKanji[] =>
  kanjis.map((kanji) => formatKanjiForServer(kanji));

export default {
  async getKanjiById(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji | null> {
    const serverKanji = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPublic).get<ServerKanji>(`/kanjis/${kanjiId}`),
      setErrorStatus
    );
    return serverKanji && parseServerKanji(serverKanji);
  },

  async getKanjisByIds(
    kanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const serverKanjis = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPublic).get<ServerKanji[]>(`/kanjis/`, { params: { kanjiIds } }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const serverKanjis = await catchAxiosErrors(
      () => (axiosInstance ?? axiosPublic).get<ServerKanji[]>(`/kanjis/${listName}`),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const serverKanjis = await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPublic).get<ServerKanji[]>(`/kanjis/${listName}`, {
          params: { s: startIndex, e: endIndex },
        }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async searchKanjis(
    request: string,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<Kanji[] | null> {
    const serverKanjis = await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPublic).get<ServerKanji[]>('/kanjis/search', {
          params: { s: request },
        }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async addKanji(
    listName: KanjiListName,
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    axiosInstance?: AxiosInstance
  ): Promise<any> {
    return await catchAxiosErrors(
      () =>
        (axiosInstance ?? axiosPrivate).post(`/kanjis/${listName}`, formatKanjiForServer(newKanji)),
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
      () => (axiosInstance ?? axiosPrivate).put(`/kanjis/${id}`, formatKanjiForServer(editedKanji)),
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
