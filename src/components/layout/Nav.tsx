import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ShowAtMedia from './ShowAtMedia';
import DropDownMenu from './DropDownMenu';
import { Link } from 'react-router-dom';
import UserButton from './UserButton';
import ThemeSwitch from './ThemeSwitch';
import LanguageSwitch from './LanguageSwitch';

type Tab = { title: string; to: string };

const Nav = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const tabs: Tab[] =
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

  const activeTab = tabs.find((tab) => tab.to === location.pathname);

  return (
    <nav role="navigation" className="app-paddings">
      <ShowAtMedia min="xs">
        <div className="flex">
          {tabs.map((link, index) => (
            <NavLink
              className="w-5 flex-grow rounded-b-sm p-0.5 text-center text-black transition-colors hover:bg-black hover:bg-opacity-20 dark:text-soft-white dark:hover:bg-white dark:hover:bg-opacity-10 [&.active]:text-white [&.active]:[background:theme('colors.primary')!important]"
              to={link.to}
              key={index}
            >
              {link.title}
            </NavLink>
          ))}
        </div>
      </ShowAtMedia>

      <ShowAtMedia max="xs">
        <DropDownMenu
          title={activeTab?.title ?? t('Layout.Nav.Navigation')}
          expandedTitle={t('Layout.Nav.Navigation')}
          className="flex flex-col gap-1.5 [&>div>*]:rounded-sm [&>div>*]:p-0.5 [&>div>*]:text-center [&>div>*]:text-black [&>div>*]:dark:text-soft-white [&>div>:hover]:bg-black [&>div>:hover]:bg-opacity-20 [&>div>:hover]:underline [&>div>:hover]:dark:bg-white [&>div>:hover]:dark:bg-opacity-10"
        >
          <div className="flex flex-col">
            {tabs.map((link, index) => (
              <Link to={link.to} key={index}>
                {link.title}
              </Link>
            ))}
          </div>

          <div className="flex flex-col rounded-md border-[1.5px] border-gray p-1.5 dark:border-dark-gray">
            <UserButton />
            <ThemeSwitch />
            <LanguageSwitch />
          </div>
        </DropDownMenu>
      </ShowAtMedia>
    </nav>
  );
};
export default Nav;
