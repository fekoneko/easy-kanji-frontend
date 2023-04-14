import axios from 'axios';
import { catchAxiosErrors, SetErrorStatus } from '../controllers/axiosController';
import { Kanji } from '../contexts/kanjiContext';

const kanjisAxios = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/kanjis` });

type KanjiListName = 'popular' | 'saved';

export default {
  async getKanjiById(id: number, setErrorStatus?: SetErrorStatus): Promise<Kanji | null> {
    return await catchAxiosErrors(() => kanjisAxios.get(`/${id}`), setErrorStatus);
  },

  async getKanjisByIds(ids: number[], setErrorStatus?: SetErrorStatus): Promise<Kanji[] | null> {
    return await catchAxiosErrors(() => kanjisAxios.get(`/`, { params: { ids } }), setErrorStatus);
  },

  async getKanjiList(
    listName: KanjiListName,
    setErrorStatus?: SetErrorStatus
  ): Promise<Kanji[] | null> {
    return await catchAxiosErrors(() => kanjisAxios.get(`/${listName}`), setErrorStatus);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setErrorStatus?: SetErrorStatus
  ): Promise<Kanji[] | null> {
    return await catchAxiosErrors(
      () => kanjisAxios.get(`/${listName}`, { params: { s: startIndex, e: endIndex } }),
      setErrorStatus
    );
  },

  async searchKanjis(request: string, setErrorStatus?: SetErrorStatus): Promise<Kanji[] | null> {
    return await catchAxiosErrors(
      () => kanjisAxios.get('/search', { params: { s: request } }),
      setErrorStatus
    );
  },

  async addKanji(
    listName: KanjiListName,
    newKanji: Kanji,
    setErrorStatus?: SetErrorStatus
  ): Promise<any> {
    return await catchAxiosErrors(() => kanjisAxios.post(`/${listName}`, newKanji), setErrorStatus);
  },

  async editKanji(id: number, editedKanji: Kanji, setErrorStatus?: SetErrorStatus): Promise<any> {
    return await catchAxiosErrors(() => kanjisAxios.put(`/${id}`, editedKanji), setErrorStatus);
  },

  async deleteKanji(id: number, setErrorStatus?: SetErrorStatus): Promise<any> {
    return await catchAxiosErrors(() => kanjisAxios.delete(`/${id}`), setErrorStatus);
  },
};
