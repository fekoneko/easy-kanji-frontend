import { Link, useLocation } from 'react-router-dom';
import UserButton from '../content/UserButton';

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <Link className="siteTitle" to="/popular" role="banner">
        EasyKanji
      </Link>
      {location.pathname.split('/')[1] === 'learn' ? (
        <Link className="learnButton" to={location.state?.from ?? '/popular'}>
          Закончить обучение
        </Link>
      ) : (
        <Link className="learnButton" to="/learn/by-meaning" state={{ from: location.pathname }}>
          Режим обучения
        </Link>
      )}
      <UserButton />
    </header>
  );
};
export default Header;
