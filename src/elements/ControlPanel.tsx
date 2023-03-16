import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import globalContext from '../contexts/globalContext';
import kanjiContext, { Kanji } from '../contexts/kanjiContext';
import {
  deselectKanjiArray,
  isKanjiArraySelected,
  selectKanjiArray,
} from '../controllers/kanjiController';

const ControlPanel = () => {
  const { section } = useContext(globalContext);
  const location = useLocation();
  const { popularKanjis, savedKanjis, searchKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  let selectedCount: number | null = null;
  let allCount: number | null = null;
  let displayedKanjis: null | Kanji[] = null;
  if (section === 'main') {
    switch (location.pathname) {
      case '/popular':
        displayedKanjis = popularKanjis;
        break;
      case '/saved':
        displayedKanjis = savedKanjis;
        break;
      case '/search':
        displayedKanjis = searchKanjis;
        break;
    }
    if (displayedKanjis) allCount = displayedKanjis?.length;
    selectedCount = selectedKanjis.length;
  }

  const deselectDisplayed = () => {
    if (!displayedKanjis) return;
    deselectKanjiArray(setSelectedKanjis, displayedKanjis);
  };

  const selectDisplayed = () => {
    if (!displayedKanjis) return;
    selectKanjiArray(setSelectedKanjis, displayedKanjis);
  };

  const clearSelection = () => {
    setSelectedKanjis([]);
  };

  return (
    <div className="controlPanel">
      {section === 'main' ? (
        location.pathname !== '/selected' ? (
          <>
            <p>{`выделено ${selectedCount} из ${allCount}`}</p>
            {displayedKanjis && isKanjiArraySelected(selectedKanjis, displayedKanjis) ? (
              <button onClick={deselectDisplayed}>снять выделение</button>
            ) : (
              <button onClick={selectDisplayed}>выделить всё</button>
            )}
          </>
        ) : (
          <>
            <p>{`выделено ${selectedCount}`}</p>
            <button onClick={clearSelection}>очистить список</button>
          </>
        )
      ) : (
        <p style={{ textAlign: 'center' }}>
          Используйте стрелки для перемещения. Пробел переворачивает карточку
        </p>
      )}
    </div>
  );
};
export default ControlPanel;
