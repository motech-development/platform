import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next';

await i18n
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .use(initReactI18next)
  .init({
    defaultNS: 'shell',
    fallbackLng: 'en-GB',
    interpolation: {
      escapeValue: false,
    },
    lng: 'en-GB',
    ns: [],
    react: {
      useSuspense: false,
    },
    returnNull: false,
    supportedLngs: ['en-GB'],
  });

export default i18n;
