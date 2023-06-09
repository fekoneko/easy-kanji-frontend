import { NavLink, useLocation } from 'react-router-dom';
import ProtectedContent from '../content/ProtectedContent';
import { useTranslation } from 'react-i18next';

const Nav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav role="navigation">
      {location.pathname.split('/')[1] === 'learn' ? (
        <>
          <NavLink to="/learn/by-meaning">{t('Layout.Nav.LearnByMeaning')}</NavLink>
          <NavLink to="/learn/by-writing">{t('Layout.Nav.LearnByWriting')}</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/popular">{t('Layout.Nav.Popular')}</NavLink>
          <ProtectedContent>
            <NavLink to="/saved">{t('Layout.Nav.Saved')}</NavLink>
          </ProtectedContent>
          <NavLink to="/search">{t('Layout.Nav.Search')}</NavLink>
          <NavLink to="/selected">{t('Layout.Nav.Selected')}</NavLink>
        </>
      )}
    </nav>
  );
};
export default Nav;
