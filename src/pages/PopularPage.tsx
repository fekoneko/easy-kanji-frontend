import { RefObject } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import usePageKanjis from '../hooks/usePageKanjis';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, pageKanjis, setPageKanjis, (startIndex, endIndex) =>
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
      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} maxCellWidth={280} maxColumns={3} />
      ) : (
        <div className="contentPlaceholder">
          <p>Тут пока ничего нет</p>
        </div>
      )}
    </div>
  );
};
export default PopularPage;
