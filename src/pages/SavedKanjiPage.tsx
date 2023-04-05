import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import kanjisApi from '../api/kanjisApi';

const SavedKanjiPage = () => {
  const { savedKanjis, setSavedKanjis } = useContext(kanjiContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const updateSavedKanjis = async () => {
      const newSavedKanjis = await kanjisApi.getKanjiListPart('saved', 1, 100, setError);
      if (newSavedKanjis) setSavedKanjis(newSavedKanjis);
      setIsLoading(false);
    };
    updateSavedKanjis();
  }, []);

  return (
    <div className="scrollContent">
      <h1>Сохранённые кандзи</h1>
      <KanjiGrid kanjis={savedKanjis} />
    </div>
  );
};
export default SavedKanjiPage;
