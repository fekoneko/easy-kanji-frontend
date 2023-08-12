import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type Link = { title: string; to: string };

const Nav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const links: Link[] =
    location.pathname.split('/')[1] === 'learn'
      ? [
          { title: t('Layout.Nav.LearnByMeaning'), to: '/learn/by-meaning' },
          { title: t('Layout.Nav.LearnByWriting'), to: '/learn/by-writing' },
        ]
      : [
          { title: t('Layout.Nav.Popular'), to: '/popular' },
          { title: t('Layout.Nav.Saved'), to: '/saved' },
          { title: t('Layout.Nav.Search'), to: '/search' },
          { title: t('Layout.Nav.Selected'), to: '/selected' },
        ];

  return (
    <nav role="navigation" className="app-paddings flex">
      {links.map((link, index) => (
        <NavLink
          className="w-5 flex-grow rounded-b-sm p-0.5 text-center text-black hover:bg-black hover:bg-opacity-20 dark:text-soft-white dark:hover:bg-white dark:hover:bg-opacity-10 [&.active]:text-white [&.active]:[background:theme('colors.primary')!important]"
          to={link.to}
          key={index}
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  );
};
export default Nav;
