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
  const { popularKanjis, savedKanjis, searchKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  const section = location.pathname.split('/')[1];

  let displayedKanjis: null | Kanji[] = null;
  switch (section) {
    case 'popular':
      displayedKanjis = popularKanjis;
      break;
    case 'saved':
      displayedKanjis = savedKanjis;
      break;
    case 'search':
      displayedKanjis = searchKanjis;
      break;
    case 'selected':
      displayedKanjis = selectedKanjis;
      break;
  }

  const deselectAll = () =>
    displayedKanjis && removeKanjisFromList(setSelectedKanjis, displayedKanjis);

  const selectAll = () => displayedKanjis && addKanjisToList(setSelectedKanjis, displayedKanjis);

  const clearSelection = () => setSelectedKanjis([]);

  const getSelectedCount = () =>
    displayedKanjis && getCountOfKanjisInList(selectedKanjis, displayedKanjis);

  const isAllSelected = () => displayedKanjis && isKanjisInList(selectedKanjis, displayedKanjis);

  switch (section) {
    case 'popular':
    case 'saved':
    case 'search':
      return (
        <footer role="contentinfo">
          <p>{`выделено ${displayedKanjis ? getSelectedCount() : '?'} из ${
            displayedKanjis?.length
          }`}</p>
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
