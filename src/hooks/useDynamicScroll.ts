import { Dispatch, SetStateAction, useEffect } from 'react';
import { Kanji } from '../contexts/kanjiContext';
import kanjisApi from '../api/kanjisApi';

const useDynamicScroll = (
  kanjs: Kanji[],
  setKanjis: Dispatch<SetStateAction<Kanji[]>> /*TODO scrollPosition*/
) => {
  useEffect(() => {
    const updatePopularKanjis = async () => {
      const newPopularKanjis = await kanjisApi.getKanjiListPart('popular', 1, 100);
      if (newPopularKanjis) setKanjis(newPopularKanjis);
    };
    updatePopularKanjis();
  }, []);
  // TODO
};
export default useDynamicScroll;
