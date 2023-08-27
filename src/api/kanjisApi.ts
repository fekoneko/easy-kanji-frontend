import { AxiosError } from 'axios';
import { Kanji } from '../contexts/kanjiContext';
import { axiosInstance } from './axiosInstance';
import ApiError from './ApiError';

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
  onReadings: serverKanji.onReadings ? serverKanji.onReadings.split(',') : [],
  kunReadings: serverKanji.kunReadings ? serverKanji.kunReadings.split(',') : [],
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
  async getKanjiById(kanjiId: number, signal?: AbortSignal): Promise<Kanji | unknown> {
    try {
      const response = await axiosInstance.get<ServerKanji>(`/kanjis/${kanjiId}`, { signal });
      return parseServerKanji(response.data);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async getKanjisByIds(kanjiIds: number[], signal?: AbortSignal): Promise<Kanji[]> {
    const serverKanjis: ServerKanji[] = [];

    const getKanjiRange = async (startIndex: number) => {
      const idsToLoad = kanjiIds.slice(startIndex, startIndex + 200);

      try {
        const response = await axiosInstance.get<ServerKanji[]>(
          `/kanjis/?${idsToLoad.map((id) => `ids=${id}`).join('&')}`,
          {
            signal,
          }
        );
        response.data?.forEach((kanji, index) => (serverKanjis[startIndex + index] = kanji));
      } catch (err: any) {
        if (signal?.aborted) throw new ApiError(undefined, true);
        if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
        throw new ApiError('unknown');
      }
    };

    const promises: Promise<void>[] = [];
    for (let i = 0; i < kanjiIds.length; i += 200) {
      promises.push(getKanjiRange(i));
    }

    for (let i = 0; i < promises.length; i++) await promises[i];

    return parseServerKanjis(serverKanjis);
  },

  async getKanjiList(listName: KanjiListName, signal?: AbortSignal): Promise<Kanji[]> {
    try {
      const response = await axiosInstance.get<ServerKanji[]>(`/kanjis/${listName}`, {
        signal,
      });
      return parseServerKanjis(response.data);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    signal?: AbortSignal
  ): Promise<Kanji[]> {
    try {
      const response = await axiosInstance.get<ServerKanji[]>(`/kanjis/${listName}`, {
        params: { s: startIndex, e: endIndex },
        signal,
      });
      return parseServerKanjis(response.data);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async searchKanjis(request: string, signal?: AbortSignal): Promise<Kanji[]> {
    try {
      const response = await axiosInstance.get<ServerKanji[]>('/kanjis/search', {
        params: { q: request },
        signal,
      });
      return parseServerKanjis(response.data);
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async addKanji(newKanji: Kanji, signal?: AbortSignal): Promise<void> {
    const kanjiData: any = { ...newKanji };
    delete kanjiData.id;

    try {
      await axiosInstance.post(`/kanjis/`, formatKanjiForServer(kanjiData), { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async editKanji(id: number, editedKanji: Kanji, signal?: AbortSignal): Promise<void> {
    const kanjiData: any = { ...editedKanji };
    delete kanjiData.id;

    try {
      await axiosInstance.patch(`/kanjis/${id}`, formatKanjiForServer(kanjiData), { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },

  async deleteKanji(kanjiId: number, signal?: AbortSignal): Promise<void> {
    try {
      await axiosInstance.delete(`/kanjis/${kanjiId}`, { signal });
    } catch (err: any) {
      if (signal?.aborted) throw new ApiError(undefined, true);
      if ((err as AxiosError).status === 401) throw new ApiError('unauthorized');
      throw new ApiError('unknown');
    }
  },
};
