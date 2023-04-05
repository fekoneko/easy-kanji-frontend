import axios, { AxiosResponse } from 'axios';
import { Kanji } from '../contexts/kanjiContext';
import { Dispatch, SetStateAction } from 'react';

const kanjisAxios = axios.create({ baseURL: `${import.meta.env.VITE_API_URL}/kanjis` });

type KanjiListName = 'popular' | 'saved';
type SetError = Dispatch<SetStateAction<Error | null>>;

export default {
  async catchAxiosErrors<T>(
    getResponse: () => Promise<AxiosResponse<T>>,
    setError?: SetError
  ): Promise<T | null> {
    let response: AxiosResponse<T> | null = null;
    try {
      response = await getResponse();
      if (setError) setError(null);
    } catch (err) {
      if (setError) setError(err as Error);
    } finally {
      return response ? response.data : null;
    }
  },

  async getKanjiById(id: number, setError?: SetError): Promise<Kanji | null> {
    return await this.catchAxiosErrors(() => kanjisAxios.get(`/${id}`), setError);
  },

  async getKanjisByIds(ids: number[], setError?: SetError): Promise<Kanji[] | null> {
    return await this.catchAxiosErrors(() => kanjisAxios.get(`/`, { params: { ids } }), setError);
  },

  async getKanjiList(listName: KanjiListName, setError?: SetError): Promise<Kanji[] | null> {
    return await this.catchAxiosErrors(() => kanjisAxios.get(`/${listName}`), setError);
  },

  async getKanjiListPart(
    listName: KanjiListName,
    startIndex: number,
    endIndex: number,
    setError?: SetError
  ): Promise<Kanji[] | null> {
    return await this.catchAxiosErrors(
      () => kanjisAxios.get(`/${listName}`, { params: { s: startIndex, e: endIndex } }),
      setError
    );
  },

  async searchKanjis(request: string, setError?: SetError): Promise<Kanji[] | null> {
    return await this.catchAxiosErrors(
      () => kanjisAxios.get('/search', { params: { s: request } }),
      setError
    );
  },

  async addKanji(listName: KanjiListName, newKanji: Kanji, setError?: SetError): Promise<any> {
    return await this.catchAxiosErrors(() => kanjisAxios.post(`/${listName}`, newKanji), setError);
  },

  async editKanji(id: number, editedKanji: Kanji, setError?: SetError): Promise<any> {
    return await this.catchAxiosErrors(() => kanjisAxios.put(`/${id}`, editedKanji), setError);
  },

  async deleteKanji(id: number, setError?: SetError): Promise<any> {
    return await this.catchAxiosErrors(() => kanjisAxios.delete(`/${id}`), setError);
  },
};
