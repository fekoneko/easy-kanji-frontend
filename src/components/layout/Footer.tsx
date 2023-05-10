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
import Info from '../content/Info';

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
                <Info tooltipAnchorRef={footerRef} caption="помощь">
                  <p>Добро пожаловать в режим обучения!</p>
                  <p>
                    Ваша задача – вспомнить всю недостающую информацию о кандзи, смотря на лицевую
                    сторону карточки. Затем Вы можете проверить себя, перевернув карточку. Если Вы
                    не смогли что-то вспомнить сейчас или думали слишком долго, отложите кандзи для
                    дальнейшего повторения и переходите к следующему. Когда вы окажетесь в конце
                    списка, Вам будет предложено повторить все кандзи, которые вы отложили.
                  </p>
                  <p>Продолжайте повторение до тех пор, пока не сможете назвать все кандзи</p>
                  <p>
                    Советуется повторять тренировки периодически, каждый раз добавляя небольшое
                    количество неизвестных кандзи
                  </p>

                  <ul>
                    <li>
                      <p>
                        Используйте стрелки <span className="key">←</span>
                        <span className="key">→</span> для перемещения.
                      </p>
                    </li>

                    <li>
                      <p>
                        Используйте <span className="key">Пробел</span>, чтобы перевернуть карточку.
                      </p>
                    </li>

                    <li>
                      <p>
                        Нажмите <span className="key">Enter</span>, чтобы пометить кандзи для
                        дальнейшего повторения.
                      </p>
                    </li>
                  </ul>
                </Info>
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
