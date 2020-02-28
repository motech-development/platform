import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-xhr-backend';
import { initReactI18next } from 'react-i18next';

const debug = process.env.NODE_ENV !== 'production';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug,
    defaultNS: 'global',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['global'],
  });

export default i18n;
