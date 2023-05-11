import { Dispatch, ReactNode, SetStateAction, createContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import useSetting from '../hooks/useSetting';
import i18n from '../i18n';

const LIGHT_THEME_LOCATION = '/themes/light-theme.css';
const DARK_THEME_LOCATION = '/themes/dark-theme.css';

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'ja';

type SettingsContextValue = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
};
type SettingsContextProps = { children: ReactNode };

const settingsContext = createContext({} as SettingsContextValue);

export const SettingsContextProvider = ({ children }: SettingsContextProps) => {
  const [theme, setTheme] = useSetting<Theme>('theme', 'light');
  const [language, setLanguage] = useSetting<Language>('language', 'ru');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <>
      <settingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
        {children}
      </settingsContext.Provider>
      <Helmet>
        <link
          href={theme === 'light' ? LIGHT_THEME_LOCATION : DARK_THEME_LOCATION}
          rel="stylesheet"
        />
      </Helmet>
    </>
  );
};

export default settingsContext;
