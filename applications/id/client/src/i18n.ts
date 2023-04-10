import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ChainedBackend, { ChainedBackendOptions } from 'i18next-chained-backend';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

const debug = process.env.NODE_ENV !== 'production';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(ChainedBackend)
  .init<ChainedBackendOptions>({
    backend: {
      backends: [
        resourcesToBackend(
          (language: string, namespace: string) =>
            import(`./locales/${language}/${namespace}.json`),
        ),
      ],
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
