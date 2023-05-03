import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Kanji } from '../../contexts/kanjiContext';
import KanjiChoiceSidebar from './KanjiChoiceSidebar';
import EditKanjiForm from '../forms/EditKanjiForm';
import usePageKanjis from '../../hooks/usePageKanjis';

export const KANJI_LIST_NAMES = ['popular']; // TODO Move it somwere

const EditKanjisUI = () => {
  const [pageKanjis, setPageKanjis] = usePageKanjis();
  const [chosenKanji, setChosenKanji] = useState<Kanji | null>(null);

  return (
    <section className="editKanjisUI">
      <Routes>
        <Route
          path={'popular'}
          element={
            <KanjiChoiceSidebar
              kanjis={pageKanjis}
              setKanjis={setPageKanjis}
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
