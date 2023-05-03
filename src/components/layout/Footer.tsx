import { useContext, useRef, useState } from 'react';
import kanjiContext from '../../contexts/kanjiContext';
import {
  removeKanjisFromList,
  isKanjisInList,
  getCountOfKanjisInList,
  addKanjisToList,
  shuffleKanjiList,
} from '../../controllers/kanjiController';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getFromLocalStorage } from '../../controllers/localStorageController';
import { useEffect } from 'react';
import { setInLocalStorage } from '../../controllers/localStorageController';
import InfoHover from '../content/InfoHover';

const Footer = () => {
  const location = useLocation();
  const { pageKanjis, setPageKanjis, selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);
  const footerRef = useRef<HTMLElement>(null);
  const [learnModeShuffle, setLearnModeShuffle] = useState<boolean>(
    getFromLocalStorage<boolean>('learnModeShuffle') ?? false
  );

  useEffect(() => {
    setInLocalStorage('learnModeShuffle', learnModeShuffle);
    if (learnModeShuffle) shuffleKanjiList(setPageKanjis);
    else setPageKanjis(selectedKanjis);
  }, [learnModeShuffle]);

  const section = location.pathname.split('/')[1];

  const deselectAll = () => pageKanjis && removeKanjisFromList(setSelectedKanjis, pageKanjis);

  const selectAll = () => pageKanjis && addKanjisToList(setSelectedKanjis, pageKanjis);

  const clearSelection = () => setSelectedKanjis([]);

  const getSelectedCount = () => pageKanjis && getCountOfKanjisInList(selectedKanjis, pageKanjis);

  const isAllSelected = () => pageKanjis && isKanjisInList(selectedKanjis, pageKanjis);

  return (
    <footer ref={footerRef} role="contentinfo">
      {(() => {
        switch (section) {
          case 'popular':
          case 'saved':
          case 'search':
            return (
              <>
                <p>{`выделено ${pageKanjis ? getSelectedCount() : '?'} из ${
                  pageKanjis?.length
                }`}</p>
                {isAllSelected() ? (
                  <button onClick={deselectAll}>снять выделение</button>
                ) : (
                  <button onClick={selectAll}>выделить всё</button>
                )}
              </>
            );

          case 'selected':
            return (
              <>
                <p>{`выделено ${selectedKanjis ? selectedKanjis.length : '?'}`}</p>
                <button onClick={clearSelection}>очистить список</button>
              </>
            );

          case 'learn':
            return (
              <>
                <InfoHover tooltipAnchorRef={footerRef} caption="помощь">
                  Используйте стрелки для перемещения. Пробел переворачивает карточку
                </InfoHover>
                <button
                  onClick={(e: any) => {
                    setLearnModeShuffle((prev) => !prev);
                    e.target.blur();
                  }}
                >
                  перемешать карточки
                </button>
              </>
            );

          default:
            return (
              <>
                <p>EasyKanji</p>
                <Link to="/feedback">Оставить отзыв</Link>
              </>
            );
        }
      })()}
    </footer>
  );
};
export default Footer;
