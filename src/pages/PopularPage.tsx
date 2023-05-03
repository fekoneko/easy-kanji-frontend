import { RefObject, useEffect, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import usePageKanjis from '../hooks/usePageKanjis';
import usePopup from '../hooks/usePopup';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const { showPopup } = usePopup();
  const [getKanjisErrorStatus, setGetKanjisErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, pageKanjis, setPageKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      setGetKanjisErrorStatus,
      abortControllerRef.current.signal
    )
  );

  useEffect(() => {
    if (getKanjisErrorStatus) showPopup('Ошибка загрузки');
  }, [getKanjisErrorStatus]);

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
