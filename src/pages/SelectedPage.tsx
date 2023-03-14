import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const SelectedPage = () => {
  const { selectedKanjis, setSelectedKanjis } = useContext(kanjiContext);

  return (
    <main role="main">
      <h1>Выбранные кандзи</h1>
      <KanjiGrid kanjis={selectedKanjis} />
    </main>
  );
};
export default SelectedPage;
