import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="scrollContent">
      <div className="contentPlaceholder">
        <h1>404</h1>
        <h2>Страница не найдена</h2>
        <p>
          Перейдите в раздел <Link to="/popular">Популярные</Link>
        </p>
      </div>
    </div>
  );
};
export default PageNotFound;
