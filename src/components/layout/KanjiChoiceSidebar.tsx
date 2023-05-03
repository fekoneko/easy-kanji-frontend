import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import { KANJI_LIST_NAMES } from './EditKanjisUI';
import { NavLink } from 'react-router-dom';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import kanjisApi from '../../api/kanjisApi';
import useAbortController from '../../hooks/useAbortController';
import usePopup from '../../hooks/usePopup';
import LoadingSpinner from '../animations/LoadingSpinner';

type KanjiSelectionSidebarProps = {
  kanjis: Kanji[];
  setKanjis: Dispatch<SetStateAction<Kanji[]>>;
  chosenKanji: Kanji | null;
  setChosenKanji: Dispatch<SetStateAction<Kanji | null>>;
};

const KanjiChoiceSidebar = ({
  kanjis,
  setKanjis,
  chosenKanji,
  setChosenKanji,
}: KanjiSelectionSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { showPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [getKanjisErrorStatus, setGetKanjisErrorStatus] = useState<number | null>(null);
  const abortControllerRef = useAbortController();

  useDynamicScroll(scrollContainerRef, kanjis, setKanjis, (startIndex, endIndex) =>
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
    <aside>
      <nav>
        {KANJI_LIST_NAMES.map((listName, index) => (
          <NavLink to={`/edit/${listName}`} key={index}>
            {listName}
          </NavLink>
        ))}
      </nav>
      {kanjis.length > 0 ? (
        <div ref={scrollContainerRef} style={{ overflowY: 'scroll' }}>
          <KanjiGrid
            kanjis={kanjis}
            maxColumns={1}
            kanjiChoiceMode
            chosenKanji={chosenKanji}
            setChosenKanji={setChosenKanji}
            detailedMode
          />
        </div>
      ) : loading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="contentPlaceholder">
          <p>Пустой список</p>
        </div>
      )}
    </aside>
  );
};
export default KanjiChoiceSidebar;
