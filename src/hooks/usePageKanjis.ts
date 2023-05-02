import { Dispatch, SetStateAction, useContext, useEffect } from 'react';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';

const usePageKanjis = (
  value?: Kanji[]
): [pageKanjis: Kanji[], setPageKanjs: Dispatch<SetStateAction<Kanji[]>>] => {
  const { pageKanjis, setPageKanjis } = useContext(kanjiContext);

  useEffect(() => {
    setPageKanjis(value ?? []);
    return () => setPageKanjis([]);
  }, [value]);

  return [pageKanjis, setPageKanjis];
};
export default usePageKanjis;
