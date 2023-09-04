import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Kanji } from '../../contexts/kanjisContext';
import KanjiChoiceSidebar from './KanjiChoiceSidebar';
import EditKanjiForm from '../forms/EditKanjiForm';

const EditKanjisUI = () => {
  const [chosenKanji, setChosenKanji] = useState<Kanji | null>(null);

  return (
    <section className="grid flex-grow grid-cols-2 gap-2">
      <Routes>
        <Route
          path="popular"
          element={<KanjiChoiceSidebar chosenKanji={chosenKanji} setChosenKanji={setChosenKanji} />}
        />
        <Route path="*" element={<Navigate to="popular" />} />
      </Routes>
      <div>
        <EditKanjiForm initialKanji={chosenKanji} />
      </div>
    </section>
  );
};
export default EditKanjisUI;
