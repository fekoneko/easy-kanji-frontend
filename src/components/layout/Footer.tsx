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
import { useEffect } from 'react';
import InfoHover from '../content/InfoHover';

const Footer = () => {
  const location = useLocation();
  const footerRef = useRef<HTMLElement>(null);
  const { pageKanjis, setPageKanjis, selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);
  const [learnModeShuffleFlag, setLearnModeShuffleFlag] = useState<boolean>(false);

  const section = location.pathname.split('/')[1];

  useEffect(() => {
    if (section !== 'learn') return;
    setPageKanjis(selectedKanjis);
  }, [selectedKanjis]);

  useEffect(() => {
    if (section !== 'learn') return;
    if (learnModeShuffleFlag) shuffleKanjiList(setPageKanjis);
    else setPageKanjis(selectedKanjis);
  }, [learnModeShuffleFlag]);

  useEffect(() => {
    setLearnModeShuffleFlag(false);
  }, [location]);

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
                    setLearnModeShuffleFlag((prev) => !prev);
                    e.target.blur();
                  }}
                >
                  {learnModeShuffleFlag ? 'карточки перемешаны' : 'перемешать карточки'}
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
