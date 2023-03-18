import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { showModalFunction } from '../App';
import globalContext from '../contexts/globalContext';
import UserButton from './UserButton';

type HeaderProps = {
  showModal: showModalFunction;
};

const Header = ({ showModal }: HeaderProps) => {
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
      <UserButton showModal={showModal} />
    </header>
  );
};
export default Header;
