import { useContext } from 'react';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import {
  removeKanjisFromList,
  isKanjisInList,
  getCountOfKanjisInList,
  addKanjisToList,
} from '../../controllers/kanjiController';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const { pageKanjis, selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  const section = location.pathname.split('/')[1];

  const deselectAll = () => pageKanjis && removeKanjisFromList(setSelectedKanjis, pageKanjis);

  const selectAll = () => pageKanjis && addKanjisToList(setSelectedKanjis, pageKanjis);

  const clearSelection = () => setSelectedKanjis([]);

  const getSelectedCount = () => pageKanjis && getCountOfKanjisInList(selectedKanjis, pageKanjis);

  const isAllSelected = () => pageKanjis && isKanjisInList(selectedKanjis, pageKanjis);

  switch (section) {
    case 'popular':
    case 'saved':
    case 'search':
      return (
        <footer role="contentinfo">
          <p>{`выделено ${pageKanjis ? getSelectedCount() : '?'} из ${pageKanjis?.length}`}</p>
          {isAllSelected() ? (
            <button onClick={deselectAll}>снять выделение</button>
          ) : (
            <button onClick={selectAll}>выделить всё</button>
          )}
        </footer>
      );

    case 'selected':
      return (
        <footer role="contentinfo">
          <p>{`выделено ${selectedKanjis ? selectedKanjis.length : '?'}`}</p>
          <button onClick={clearSelection}>очистить список</button>
        </footer>
      );

    case 'learn':
      return (
        <footer role="contentinfo">
          <p style={{ textAlign: 'center' }}>
            Используйте стрелки для перемещения. Пробел переворачивает карточку
          </p>
        </footer>
      );

    default:
      return (
        <footer role="contentinfo">
          <p>EasyKanji</p>
          <Link to="/feedback">Оставить отзыв</Link>
        </footer>
      );
  }
};
export default Footer;
