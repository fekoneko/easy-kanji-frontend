import { RefObject, useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, popularKanjis, setPopularKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      undefined,
      abortControllerRef.current.signal
    )
  );

  return (
    <div className="scrollContent">
      <h1>Популярные кандзи</h1>
      {popularKanjis.length > 0 ? (
        <KanjiGrid kanjis={popularKanjis} />
      ) : (
        <div className="contentPlaceholder">
          <p>Тут пока ничего нет</p>
        </div>
      )}
    </div>
  );
};
export default PopularPage;
