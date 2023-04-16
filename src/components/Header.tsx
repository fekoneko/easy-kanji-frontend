import { useContext } from 'react';
import { Link } from 'react-router-dom';
import globalContext from '../contexts/globalContext';
import UserButton from './UserButton';

const Header = () => {
  const { section } = useContext(globalContext);

  return (
    <header>
      <Link className="siteTitle" to="/popular" role="banner">
        EasyKanji
      </Link>
      {section === 'learn' ? (
        <Link className="learnButton" to="/popular">
          Закончить обучение
        </Link>
      ) : (
        <Link className="learnButton" to="/learn/by-meaning">
          Режим обучения
        </Link>
      )}
      <UserButton />
    </header>
  );
};
export default Header;
