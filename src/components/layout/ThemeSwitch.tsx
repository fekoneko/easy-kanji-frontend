import { useContext } from 'react';
import settingsContext from '../../contexts/settingsContext';
import { ReactComponent as LightThemeIcon } from '../../assets/lightTheme.svg';
import { ReactComponent as DarkThemeIcon } from '../../assets/darkTheme.svg';
import { useTranslation } from 'react-i18next';

type ThemeSwitchProps = {
  mini?: boolean;
};

const ThemeSwitch = ({ mini }: ThemeSwitchProps) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useContext(settingsContext);

  const handleThemeSwitch = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={handleThemeSwitch}
      className="[&>svg]:fill-dark-gray hover:[&>svg]:fill-black dark:[&>svg]:fill-gray dark:hover:[&>svg]:fill-white"
    >
      {mini ? (
        theme === 'light' ? (
          <LightThemeIcon />
        ) : (
          <DarkThemeIcon />
        )
      ) : theme === 'light' ? (
        t('Settings.LightTheme')
      ) : (
        t('Settings.DarkTheme')
      )}
    </button>
  );
};
export default ThemeSwitch;
