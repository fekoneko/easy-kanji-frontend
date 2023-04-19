import { Dispatch, SetStateAction } from 'react';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiGrid from '../content/KanjiGrid';
import useDynamicScroll from '../../hooks/useDynamicScroll';
import { PUBLIC_LIST_NAMES } from './EditKanjisUI';
import { NavLink } from 'react-router-dom';

type KanjiSelectionSidebarProps = {
  kanjis: Kanji[];
  setKanjis: Dispatch<SetStateAction<Kanji[]>>;
};

const KanjiSelectionSidebar = ({ kanjis, setKanjis }: KanjiSelectionSidebarProps) => {
  useDynamicScroll(kanjis, setKanjis);

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
        <KanjiGrid kanjis={kanjis} /> // TODO single column
      ) : (
        <div className="contentPlaceholder">
          <p>Пустой список</p>
        </div>
      )}
    </aside>
  );
};
export default KanjiSelectionSidebar;
