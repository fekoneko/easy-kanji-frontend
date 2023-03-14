import { useContext } from 'react';
import { Link } from 'react-router-dom';
import globalContext from '../contexts/globalContext';

const Header = () => {
  const { section } = useContext(globalContext);

  return (
    <header>
      <Link className="siteTitle" to="/" role="banner">
        EasyKanji
      </Link>
      {section === 'learn' ? (
        <Link className="learnButton" to="/">
          Закончить обучение
        </Link>
      ) : (
        <Link className="learnButton" to="/learn">
          Режим обучения
        </Link>
      )}
    </header>
  );
};
export default Header;
