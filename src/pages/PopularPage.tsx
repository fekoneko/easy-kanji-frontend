import { RefObject, useEffect, useRef, useState } from 'react';
import KanjiGrid from '../components/content/KanjiGrid';
import useDynamicScroll from '../hooks/useDynamicScroll';
import kanjisApi from '../api/kanjisApi';
import useAbortController from '../hooks/useAbortController';
import usePageKanjis from '../hooks/usePageKanjis';
import usePopup from '../hooks/usePopup';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';

type PopularPageProps = {
  mainRef: RefObject<HTMLElement>;
};

const PopularPage = ({ mainRef }: PopularPageProps) => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const titleRef = useRef<HTMLDivElement>(null);
  const { showPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [getKanjisErrorStatus, setGetKanjisErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();

  useDynamicScroll(mainRef, pageKanjis, setPageKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      setGetKanjisErrorStatus,
      setLoading,
      abortControllerRef.current.signal
    )
  );

  useEffect(() => {
    if (getKanjisErrorStatus) showPopup('Ошибка загрузки');
  }, [getKanjisErrorStatus]);

  return (
    <div className="scrollContent">
      <div className="pageTitle" ref={titleRef}>
        <h1>Популярные кандзи</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <p>
            В этом списке кандзи расположены в порядке частоты их употребления. Это хорошая идея -
            начать изучение отсюда.
          </p>

          <ul>
            <li>
              <p>
                Выделите необходимые кандзи <span className="key">щелчком мыши</span> или при помощи{' '}
                <span className="key">Пробела</span>, чтобы они появились в режиме обучения
              </p>
            </li>

            <li>
              <p>
                Если Вы вошли в аккаунт, Вы можете сохранять кандзи, нажав на иконку справа от
                значения или клавишу <span className="key">Enter</span>. Сохранённые кандзи будут
                доступны на соответствующей вкладке
              </p>
            </li>

            <li>
              <p>
                Вы можете быстро перемещаться по таблице при помощи стрелок{' '}
                <span className="key">←</span>
                <span className="key">↑</span>
                <span className="key">→</span>
                <span className="key">↓</span> (<span className="key">Shift</span> ускоряет
                перемещение)
              </p>
            </li>
          </ul>
        </Info>
      </div>

      {pageKanjis.length > 0 ? (
        <KanjiGrid kanjis={pageKanjis} maxCellWidth={280} maxColumns={3} />
      ) : loading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="contentPlaceholder">
          <p>Тут пока ничего нет</p>
        </div>
      )}
    </div>
  );
};
export default PopularPage;
