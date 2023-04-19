import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';
import { axiosPrivate, axiosPublic } from './axios';

type KanjiListName = 'popular' | 'saved';

export default {
  async getKanjiById(id: number, setErrorStatus?: SetErrorStatus): Promise<Kanji | null> {
    return await catchAxiosErrors(() => axiosPublic.get(`/kanjis/${id}`), setErrorStatus);
  },

  async getKanjisByIds(ids: number[], setErrorStatus?: SetErrorStatus): Promise<Kanji[] | null> {
    return await catchAxiosErrors(
      () => axiosPublic.get(`/kanjis/`, { params: { ids } }),
      setErrorStatus
    );
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus
  ): Promise<Kanji[] | null> {
    const axiosInstance = listName === 'saved' ? axiosPrivate : axiosPublic;
    return await catchAxiosErrors(() => axiosInstance.get(`/kanjis/${listName}`), setErrorStatus);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus
  ): Promise<Kanji[] | null> {
    const axiosInstance = listName === 'saved' ? axiosPrivate : axiosPublic;
    return await catchAxiosErrors(
      () => axiosInstance.get(`/kanjis/${listName}`, { params: { s: startIndex, e: endIndex } }),
      setErrorStatus
    );
  },

  async searchKanjis(request: string, setErrorStatus?: SetErrorStatus): Promise<Kanji[] | null> {
    return await catchAxiosErrors(
      () => axiosPublic.get('/kanjis/search', { params: { s: request } }),
      setErrorStatus
    );
  },

  async addKanji(
    listName: KanjiListName,
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus
  ): Promise<any> {
    return await catchAxiosErrors(
      () => axiosPrivate.post(`/kanjis/${listName}`, newKanji),
      setErrorStatus
    );
  },

  async editKanji(id: number, editedKanji: Kanji, setErrorStatus?: SetErrorStatus): Promise<any> {
    return await catchAxiosErrors(
      () => axiosPrivate.put(`/kanjis/${id}`, editedKanji),
      setErrorStatus
    );
  },

  async deleteKanji(id: number, setErrorStatus?: SetErrorStatus): Promise<any> {
    return await catchAxiosErrors(() => axiosPrivate.delete(`/kanjis/${id}`), setErrorStatus);
  },
};
