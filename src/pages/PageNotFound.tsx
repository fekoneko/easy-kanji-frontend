import { Link } from 'react-router-dom';
import TitledPage from '../components/routing/TitledPage';

const PageNotFound = () => {
  return (
    <TitledPage title="Страница не найдена">
      <div className="scrollContent">
        <div className="contentPlaceholder">
          <h1>404</h1>
          <h2>Страница не найдена</h2>
          <p>
            Перейдите в раздел <Link to="/popular">Популярные</Link>
          </p>
        </div>
      </div>
    </TitledPage>
  );
};
export default PageNotFound;
