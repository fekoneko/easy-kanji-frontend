import { Dispatch, SetStateAction, useRef } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import { PUBLIC_LIST_NAMES } from './EditKanjisUI';
import { NavLink } from 'react-router-dom';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import kanjisApi from '../../api/kanjisApi';

type KanjiSelectionSidebarProps = {
  kanjis: Kanji[];
  setKanjis: Dispatch<SetStateAction<Kanji[]>>;
};

const KanjiSelectionSidebar = ({ kanjis, setKanjis }: KanjiSelectionSidebarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useDynamicScroll(scrollContainerRef, kanjis, setKanjis, (startIndex, endIndex) =>
    kanjisApi.getKanjiListPart('popular', startIndex, endIndex)
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
