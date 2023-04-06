import { useContext, useEffect, useState } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/KanjiGrid';
import { Link } from 'react-router-dom';

const SavedKanjiPage = () => {
  const { savedKanjis, setSavedKanjis } = useContext(kanjiContext);

  return (
    <div className="scrollContent">
      <h1>Сохранённые кандзи</h1>
      {savedKanjis.length > 0 ? (
        <KanjiGrid kanjis={savedKanjis} />
      ) : (
        <div className="contentPlaceholder">
          <p>Вы пока не сохранили ни одного Кандзи</p>
          <p>
            Перейти в раздел <Link to="/popular">Популярные</Link>
          </p>
        </div>
      )}
    </div>
  );
};
export default SavedKanjiPage;
