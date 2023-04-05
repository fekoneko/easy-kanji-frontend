const PageNotFound = () => {
  return (
    <div className="scrollContent errorMessage">
      <h1 className="errorTitle">404</h1>
      <h1 className="errorDescription">Страница не найдена</h1>
      <p className="errorTip">
        Перейдите в раздел <a href="http://localhost:5173/popular">Популярные</a>
      </p>
    </div>
  );
};
export default PageNotFound;
