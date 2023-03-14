import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import globalContext from '../contexts/globalContext';

const Nav = () => {
  const { section } = useContext(globalContext);

  return (
    <nav role="navigation">
      {section === 'learn' ? (
        <>
          <NavLink to="/learn/by-meaning">По значению</NavLink>
          <NavLink to="/learn/by-writing">По чтению</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/popular">Популярные</NavLink>
          <NavLink to="/saved">Сохранённые</NavLink>
          <NavLink to="/search">Поиск</NavLink>
          <NavLink to="/selected">Выбранные</NavLink>
        </>
      )}
    </nav>
  );
};
export default Nav;
