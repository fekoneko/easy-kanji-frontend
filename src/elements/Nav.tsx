import { useContext } from 'react';
import { Link } from 'react-router-dom';
import globalContext from '../context/globalContext';

const Nav = () => {
  const { section } = useContext(globalContext);

  return (
    <nav role="navigation">
      {section === 'learn' ? (
        <>
          <Link to="/learn/by-meaning">По значению</Link>
          <Link to="/learn/by-writing">По чтению</Link>
        </>
      ) : (
        <>
          <Link to="/popular">Популярные</Link>
          <Link to="/saved">Сохранённые</Link>
          <Link to="/search">Поиск</Link>
        </>
      )}
    </nav>
  );
};
export default Nav;
