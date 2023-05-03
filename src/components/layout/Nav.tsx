import { NavLink, useLocation } from 'react-router-dom';
import ProtectedContent from '../content/ProtectedContent';

const Nav = () => {
  const location = useLocation();

  return (
    <nav role="navigation">
      {location.pathname.split('/')[1] === 'learn' ? (
        <>
          <NavLink to="/learn/by-meaning">По значению</NavLink>
          <NavLink to="/learn/by-writing">По написанию</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/popular">Популярные</NavLink>
          <ProtectedContent allowedRoles={['Admin']}>
            <NavLink to="/saved">Сохранённые</NavLink>
          </ProtectedContent>
          <NavLink to="/search">Поиск</NavLink>
          <NavLink to="/selected">Выбранные</NavLink>
        </>
      )}
    </nav>
  );
};
export default Nav;
