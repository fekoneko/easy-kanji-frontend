import i18n from 'i18next';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'translation';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init<HttpBackendOptions>({
    fallbackLng: 'ru',
    ns: [defaultNS],
    defaultNS,
    interpolation: {
      escapeValue: false,
    },
    backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
  });

export default i18n;
