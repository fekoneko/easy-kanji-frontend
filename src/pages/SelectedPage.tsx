import { useContext, useRef } from 'react';
import kanjiContext from '../contexts/kanjiContext';
import KanjiGrid from '../components/content/KanjiGrid';
import { Link } from 'react-router-dom';
import usePageKanjis from '../hooks/usePageKanjis';
import LoadingSpinner from '../components/animations/LoadingSpinner';
import Info from '../components/content/Info';

const SelectedPage = () => {
  const { selectedKanjis, selectedKanjisLoading } = useContext(kanjiContext);
  usePageKanjis(selectedKanjis);
  const titleRef = useRef<HTMLDivElement>(null);

  return (
    <div className="scrollContent">
      <div className="pageTitle" ref={titleRef}>
        <h1>Выбранные кандзи</h1>
        <Info tooltipId="searchHint" tooltipAnchorRef={titleRef}>
          <p>
            Здесь расположены кандзи, которые вы выделили. Перейдите в режим обучения, чтобы начать
            их изучение.
          </p>

          <ul>
            <li>
              <p>
                Вы можете снять выделение с кандзи <span className="key">щелчком мыши</span> или при
                помощи <span className="key">Пробела</span> или очистить список целиком, нажав на
                кнопку снизу
              </p>
            </li>

            <li>
              <p>
                Если Вы вошли в аккаунт, Вы можете сохранять кандзи, нажав на иконку справа от
                значения или клавишу <span className="key">Enter</span>. Сохранённые кандзи будут
                доступны на соответствующей вкладке
              </p>
            </li>
          </ul>
        </Info>
      </div>

      {selectedKanjis.length > 0 ? (
        <KanjiGrid kanjis={selectedKanjis} maxCellWidth={280} maxColumns={3} />
      ) : selectedKanjisLoading ? (
        <div className="contentPlaceholder">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="contentPlaceholder">
          <p>Вы пока не выбрали ни одного Кандзи</p>
          <p>
            Перейти в раздел <Link to="/popular">Популярные</Link>
          </p>
        </div>
      )}
    </div>
  );
};
export default SelectedPage;
