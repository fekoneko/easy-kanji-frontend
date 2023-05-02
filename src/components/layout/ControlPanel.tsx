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

const ControlPanel = () => {
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
        <div className="controlPanel">
          <p>{`выделено ${displayedKanjis ? getSelectedCount() : '?'} из ${
            displayedKanjis?.length
          }`}</p>
          {isAllSelected() ? (
            <button onClick={deselectAll}>снять выделение</button>
          ) : (
            <button onClick={selectAll}>выделить всё</button>
          )}
        </div>
      );

    case 'selected':
      return (
        <div className="controlPanel">
          <p>{`выделено ${selectedKanjis ? selectedKanjis.length : '?'}`}</p>
          <button onClick={clearSelection}>очистить список</button>
        </div>
      );

    case 'learn':
      return (
        <div className="controlPanel">
          <p style={{ textAlign: 'center' }}>
            Используйте стрелки для перемещения. Пробел переворачивает карточку
          </p>
        </div>
      );

    default:
      return (
        <div className="controlPanel">
          <p>EasyKanji</p>
          <Link to="/feedback">Оставить отзыв</Link>
        </div>
      );
  }
};
export default ControlPanel;
