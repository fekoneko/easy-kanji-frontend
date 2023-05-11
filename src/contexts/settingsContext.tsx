import { Dispatch, ReactNode, SetStateAction, createContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
export type Theme = 'light' | 'dark';
type SettingsContextValue = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
};
type SettingsContextProps = { children: ReactNode };

const settingsContext = createContext({} as SettingsContextValue);

export const SettingsContextProvider = ({ children }: SettingsContextProps) => {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <>
      <settingsContext.Provider value={{ theme, setTheme }}>{children}</settingsContext.Provider>
      <Helmet>
        <link
          href={`/src/styles/themes/${theme === 'light' ? 'light-theme.css' : 'dark-theme.css'}`}
          rel="stylesheet"
        />
      </Helmet>
    </>
  );
};

export default settingsContext;
