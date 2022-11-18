import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

const debug = process.env.NODE_ENV !== 'production';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `${process.env.PUBLIC_URL}/locales/{{lng}}/{{ns}}.json`,
    },
    debug,
    defaultNS: 'global',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    ns: ['global'],
  })
  .catch(() => {});

export default i18n;
