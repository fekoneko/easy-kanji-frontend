import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const SelectedPage = () => {
  const { selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  return (
    <div className="mainContent">
      <h1>Выбранные кандзи</h1>
      <KanjiGrid kanjis={selectedKanjis} />
    </div>
  );
};
export default SelectedPage;
