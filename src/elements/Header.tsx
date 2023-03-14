import { useContext } from 'react';
import { Link } from 'react-router-dom';
import globalContext from '../context/globalContext';

const Header = () => {
  const { section } = useContext(globalContext);

  return (
    <header>
      <h1 role="banner">EasyKanji</h1>
      {section === 'learn' ? (
        <Link to="/">Закончить обучение</Link>
      ) : (
        <Link to="/learn">Режим обучения</Link>
      )}
    </header>
  );
};
export default Header;
