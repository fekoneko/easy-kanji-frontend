import { useContext, useRef } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';
import TitledPage from '../components/routing/TitledPage';

const SavedKanjiPage = () => {
  const { savedKanjis, savedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(savedKanjis);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <TitledPage title="Сохранённые кандзи">
      <div className="scrollContent">
        <div className="pageTitle" ref={titleRef}>
          <h1>Сохранённые кандзи</h1>
          <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
            <p>Здесь находятся кандзи, которые вы сохранили к себе в профиль.</p>

            <ul>
              <li>
                <p>
                  Выделите необходимые кандзи <span className="key">щелчком мыши</span> или при
                  помощи <span className="key">Пробела</span>, чтобы они появились в режиме обучения
                </p>
              </li>

              <li>
                <p>
                  Вы можете удалить ненужные кандзи, нажав на галочку справа от значения или клавишу{' '}
                  <span className="key">Enter</span>
                </p>
              </li>
            </ul>
          </Info>
        </div>

        {savedKanjis.length > 0 ? (
          <KanjiGrid kanjis={savedKanjis} maxCellWidth={280} maxColumns={3} />
        ) : savedKanjisLoading ? (
          <div className="contentPlaceholder">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="contentPlaceholder">
            <p>Вы пока не сохранили ни одного Кандзи</p>
            <p>
              Перейти в раздел <Link to="/popular">Популярные</Link>
            </p>
          </div>
        )}
      </div>
    </TitledPage>
  );
};
export default SavedKanjiPage;
