import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { closeModalFunction, showModalFunction } from '../App';
import globalContext from '../contexts/globalContext';
import UserButton from './UserButton';

type HeaderProps = {
  showModal: showModalFunction;
  closeModal: closeModalFunction;
};

const Header = ({ showModal, closeModal }: HeaderProps) => {
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
      <UserButton showModal={showModal} closeModal={closeModal} />
    </header>
  );
};
export default Header;
