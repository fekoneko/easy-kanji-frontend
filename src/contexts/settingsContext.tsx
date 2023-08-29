import { Dispatch, ReactNode, SetStateAction, createContext, useEffect } from 'react';
import useSetting from '../hooks/useSetting';
import i18n from '../i18n';

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
    <div
      className={`transition-colors ${
        theme === 'dark' ? 'dark bg-soft-black text-soft-white' : ''
      }`}
    >
      <settingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
        {children}
      </settingsContext.Provider>
    </div>
  );
};

export default settingsContext;
