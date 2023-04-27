import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import { PUBLIC_LIST_NAMES } from './EditKanjisUI';
import { NavLink } from 'react-router-dom';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import kanjisApi from '../../api/kanjisApi';
import useAbortController from '../../hooks/useAbortController';

type KanjiSelectionSidebarProps = {
  kanjis: Kanji[];
  setKanjis: Dispatch<SetStateAction<Kanji[]>>;
};

const KanjiSelectionSidebar = ({ kanjis, setKanjis }: KanjiSelectionSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useAbortController();

  useDynamicScroll(scrollContainerRef, kanjis, setKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart(
      'popular',
      startIndex,
      endIndex,
      undefined,
      abortControllerRef.current.signal
    )
  );

  return (
    <aside>
      <nav>
        {PUBLIC_LIST_NAMES.map((listName, index) => (
          <NavLink to={`/edit/${listName}`} key={index}>
            Популярные
          </NavLink>
        ))}
      </nav>
      {kanjis.length > 0 ? (
        <div ref={scrollContainerRef} style={{ overflowY: 'scroll' }}>
          <KanjiGrid kanjis={kanjis} />
        </div>
      ) : (
        <div className="contentPlaceholder">
          <p>Пустой список</p>
        </div>
      )}
    </aside>
  );
};
export default KanjiSelectionSidebar;
