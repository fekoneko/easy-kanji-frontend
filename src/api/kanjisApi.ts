import { catchAxiosErrors, SetErrorStatus, SetLoading } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';
import { axiosInstance } from './axiosInstance';

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
  async getKanjiById(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji | null> {
    const [serverKanji] = await catchAxiosErrors(
      () => axiosInstance.get<ServerKanji>(`/kanjis/${kanjiId}`, { signal }),
      setErrorStatus,
      setLoading
    );
    return serverKanji && parseServerKanji(serverKanji);
  },

  async getKanjisByIds(
    kanjiIds: number[],
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const serverKanjis: ServerKanji[] = [];
    if (setLoading) setLoading(true);

    const getKanjiRange = async (startIndex: number) => {
      const idsToLoad = kanjiIds.slice(startIndex, startIndex + 200);

      const [serverKanjisPart] = await catchAxiosErrors(
        () =>
          axiosInstance.get<ServerKanji[]>(
            `/kanjis/?${idsToLoad.map((id) => `ids=${id}`).join('&')}`,
            {
              signal,
            }
          ),
        setErrorStatus
      );

      serverKanjisPart?.forEach((kanji, index) => (serverKanjis[startIndex + index] = kanji));
    };

    const promises: Promise<void>[] = [];
    for (let i = 0; i < kanjiIds.length; i += 200) {
      promises.push(getKanjiRange(i));
    }

    for (let i = 0; i < promises.length; i++) await promises[i];
    if (setLoading) setLoading(false);

    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () => axiosInstance.get<ServerKanji[]>(`/kanjis/${listName}`, { signal }),
      setErrorStatus,
      setLoading
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () =>
        axiosInstance.get<ServerKanji[]>(`/kanjis/${listName}`, {
          params: { s: startIndex, e: endIndex },
          signal,
        }),
      setErrorStatus,
      setLoading
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async searchKanjis(
    request: string,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<Kanji[] | null> {
    const [serverKanjis] = await catchAxiosErrors(
      () =>
        axiosInstance.get<ServerKanji[]>('/kanjis/search', {
          params: { q: request },
          signal,
        }),
      setErrorStatus,
      setLoading
    );
    return serverKanjis && parseServerKanjis(serverKanjis);
  },

  async addKanji(
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const kanjiData: any = { ...newKanji };
    delete kanjiData.id;
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosInstance.post(`/kanjis/`, formatKanjiForServer(kanjiData), { signal }),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },

  async editKanji(
    id: number,
    editedKanji: Kanji,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const kanjiData: any = { ...editedKanji };
    delete kanjiData.id;
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosInstance.patch(`/kanjis/${id}`, formatKanjiForServer(kanjiData), { signal }),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },

  async deleteKanji(
    kanjiId: number,
    setErrorStatus?: SetErrorStatus,
    setLoading?: SetLoading,
    signal?: AbortSignal
  ): Promise<boolean> {
    const [, errorStatus] = await catchAxiosErrors(
      () => axiosInstance.delete(`/kanjis/${kanjiId}`, { signal }),
      setErrorStatus,
      setLoading
    );
    return !errorStatus;
  },
};
