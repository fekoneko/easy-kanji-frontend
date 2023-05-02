import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';
import { axiosPrivate, axiosPublic } from './axios';

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
    signal?: AbortSignal
  ): Promise<Kanji | null> {
    const [serverKanji] = await catchAxiosErrors(
      () => axiosPublic.get<ServerKanji>(`/kanjis/${kanjiId}`, { signal }),
      setErrorStatus
    );
    return serverKanji && parseServerKanji(serverKanji);
  },

  async getKanjisByIds(
    kanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () =>
        axiosPublic.get<ServerKanji[]>(`/kanjis/?${kanjiIds.map((id) => `ids=${id}`).join('&')}`, {
          signal,
        }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () => axiosPublic.get<ServerKanji[]>(`/kanjis/${listName}`, { signal }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () =>
        axiosPublic.get<ServerKanji[]>(`/kanjis/${listName}`, {
          params: { s: startIndex, e: endIndex },
          signal,
        }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async searchKanjis(
    request: string,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () =>
        axiosPublic.get<ServerKanji[]>('/kanjis/search', {
          params: { q: request },
          signal,
        }),
      setErrorStatus
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async addKanji(
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<boolean> {
    const kanjiData: any = { ...newKanji };
    delete kanjiData.id;
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosPrivate.post(`/kanjis/`, formatKanjiForServer(kanjiData), { signal }),
      setErrorStatus
    );
    return !errorStatus;
  },

  async editKanji(
    id: number,
    editedKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<boolean> {
    const kanjiData: any = { ...editedKanji };
    delete kanjiData.id;
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosPrivate.patch(`/kanjis/${id}`, formatKanjiForServer(kanjiData), { signal }),
      setErrorStatus
    );
    return !errorStatus;
  },

  async deleteKanji(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    signal?: AbortSignal
  ): Promise<boolean> {
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosPrivate.delete(`/kanjis/${kanjiId}`, { signal }),
      setErrorStatus
    );
    return !errorStatus;
  },
};
