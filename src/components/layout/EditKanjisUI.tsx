import { useContext, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import kanjiContext, { Kanji } from '../../contexts/kanjiContext';
import KanjiSelectionSidebar from './KanjiSelectionSidebar';
import EditKanjiForm from '../forms/EditKanjiForm';
import kanjisApi from '../../api/kanjisApi';
import globalContext from '../../contexts/globalContext';

export type PublicListName = 'popular';

export const PUBLIC_LIST_NAMES = ['popular']; // TODO Move it somwere

const EditKanjisUI = () => {
  const { popularKanjis, setPopularKanjis } = useContext(kanjiContext);
  const { inSectionPath } = useContext(globalContext);
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [selectedListName, setSelectedListName] = useState<PublicListName | null>(null);
  const [editOrAddErrorCode, setEditOrAddErrorCode] = useState<number | null>(null);

  useEffect(() => {
    setEditOrAddErrorCode(null);
  }, [selectedKanji]);

  useEffect(() => {
    if (inSectionPath && PUBLIC_LIST_NAMES.includes(inSectionPath)) {
      setSelectedListName(inSectionPath as PublicListName);
    } else {
      setSelectedListName(null);
    }
  }, [inSectionPath]);

  const handleEditOrAddKanji = async (newKanji: Kanji) => {
    if (!selectedListName) return;
    if (newKanji.id === -1) {
      await kanjisApi.addKanji(selectedListName, newKanji, setEditOrAddErrorCode);
    } else {
      await kanjisApi.editKanji(newKanji.id, newKanji, setEditOrAddErrorCode);
    }
  };

  return (
    <section className="editKanjisUI">
      <Routes>
        <Route
          path={'popular'}
          element={<KanjiSelectionSidebar kanjis={popularKanjis} setKanjis={setPopularKanjis} />}
        />
        <Route path="*" element={<Navigate to="popular" />} />
      </Routes>
      <EditKanjiForm
        initialKanji={selectedKanji}
        onSubmit={handleEditOrAddKanji}
        errorShown={!!editOrAddErrorCode}
      />
    </section>
  );
};
export default EditKanjisUI;
