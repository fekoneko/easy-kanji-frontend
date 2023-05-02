import { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import KanjiSelectionSidebar from './KanjiSelectionSidebar';
import EditKanjiForm from '../forms/EditKanjiForm';

export type PublicListName = 'popular';

export const PUBLIC_LIST_NAMES = ['popular']; // TODO Move it somwere

const EditKanjisUI = () => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  const [chosenKanji, setChosenKanji] = useState<Kanji | null>(null);

  return (
    <section className="editKanjisUI">
      <Routes>
        <Route
          path={'popular'}
          element={
            <KanjiSelectionSidebar
              kanjis={popularKanjis}
              setKanjis={setPopularKanjis}
              chosenKanji={chosenKanji}
              setChosenKanji={setChosenKanji}
            />
          }
        />
        <Route path="*" element={<Navigate to="popular" />} />
      </Routes>
      <EditKanjiForm initialKanji={chosenKanji} />
    </section>
  );
};
export default EditKanjisUI;
