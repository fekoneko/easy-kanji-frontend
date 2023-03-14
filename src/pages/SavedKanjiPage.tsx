import { useContext } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../elements/KanjiGrid';

const SavedKanjiPage = () => {
  const { savedKanjis, setSavedKanjis, selectedKanjis, setSelectedKanjis } =
    useContext(kanjiContext);

  return (
    <main role="main">
      <h1>SavedKanjiPage</h1>
      <KanjiGrid kanjis={savedKanjis} />
    </main>
  );
};
export default SavedKanjiPage;
