import 'i18next';
import ru from '../../public/locales/ru/translation.json';
import { defaultNS } from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: { [defaultNS]: typeof ru };
  }
}
