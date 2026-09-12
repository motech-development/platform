import type { ReactNode } from 'react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { I18nProvider, useLocale } from 'react-aria-components/I18nProvider';
import { type Appearance, BreezeContext } from './BreezeContext';
import enGB from './en-GB';

interface BreezeProviderBaseProps {
  /** Breeze components and application content rendered inside the provider. */
  children: ReactNode;
  /** BCP 47 locale for accessible interactions and content formatting. */
  locale: string;
  /** Accessible messages translated into the provider locale; defaults to English. */
  messages?: Partial<typeof enGB>;
}

interface ControlledAppearanceProps {
  /** The application-owned appearance choice. */
  appearance: Appearance;
  /** Unavailable when `appearance` is controlled by the application. */
  defaultAppearance?: never;
  /** Reports a semantic appearance choice so the application can persist it. */
  onAppearanceChange: (appearance: Appearance) => void;
}

interface UncontrolledAppearanceProps {
  /** Unavailable when the provider manages its own appearance state. */
  appearance?: never;
  /** The initial appearance choice; defaults to automatic. */
  defaultAppearance?: Appearance;
  /** Reports a semantic appearance choice without persisting it. */
  onAppearanceChange?: (appearance: Appearance) => void;
}

/** The required locale and appearance boundary for Breeze components. */
export type BreezeProviderProps = BreezeProviderBaseProps &
  (ControlledAppearanceProps | UncontrolledAppearanceProps);

function resolveAppearance(appearance: Appearance, prefersDark: boolean) {
  if (appearance === 'automatic') {
    return prefersDark ? 'dark' : 'light';
  }

  return appearance;
}

function BreezeRoot({
  children,
}: Readonly<Pick<BreezeProviderProps, 'children'>>) {
  const { direction, locale } = useLocale();

  return (
    <div data-breeze-root="" dir={direction} lang={locale}>
      {children}
    </div>
  );
}

/**
 * Establishes the required locale and styling boundary.
 *
 * @summary Required locale and styling boundary for Breeze components.
 */
export function BreezeProvider({
  appearance: controlledAppearance,
  children,
  defaultAppearance = 'automatic',
  locale,
  messages,
  onAppearanceChange,
}: Readonly<BreezeProviderProps>) {
  const [preferredColorSchemeQuery] = useState(() =>
    typeof window === 'undefined' || !window.matchMedia
      ? null
      : window.matchMedia('(prefers-color-scheme: dark)'),
  );
  const [prefersDark, setPrefersDark] = useState(
    () => preferredColorSchemeQuery?.matches ?? false,
  );
  const [uncontrolledAppearance, setUncontrolledAppearance] =
    useState(defaultAppearance);
  const appearance = controlledAppearance ?? uncontrolledAppearance;
  const resolvedAppearance = resolveAppearance(appearance, prefersDark);

  useEffect(() => {
    if (!preferredColorSchemeQuery) {
      return undefined;
    }

    setPrefersDark(preferredColorSchemeQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersDark(event.matches);
    };

    preferredColorSchemeQuery.addEventListener('change', handleChange);

    return () =>
      preferredColorSchemeQuery.removeEventListener('change', handleChange);
  }, [preferredColorSchemeQuery]);

  useLayoutEffect(() => {
    const { documentElement } = document;
    const previousTheme = documentElement.dataset.theme;
    const previousColorScheme = documentElement.style.colorScheme;

    documentElement.dataset.theme = resolvedAppearance;
    documentElement.style.colorScheme = resolvedAppearance;

    return () => {
      if (previousTheme === undefined) {
        delete documentElement.dataset.theme;
      } else {
        documentElement.dataset.theme = previousTheme;
      }

      documentElement.style.colorScheme = previousColorScheme;
    };
  }, [resolvedAppearance]);

  const setAppearance = useCallback(
    (nextAppearance: Appearance) => {
      if (controlledAppearance === undefined) {
        setUncontrolledAppearance(nextAppearance);
      }

      onAppearanceChange?.(nextAppearance);
    },
    [controlledAppearance, onAppearanceChange],
  );
  const getMessageLocale = useCallback(
    (message: keyof typeof enGB) =>
      messages?.[message] === undefined ? 'en-GB' : locale,
    [locale, messages],
  );

  const context = useMemo(
    () => ({
      appearance,
      getMessageLocale,
      locale,
      messages: {
        appearance: messages?.appearance ?? enGB.appearance,
        appearanceAutomatic:
          messages?.appearanceAutomatic ?? enGB.appearanceAutomatic,
        appearanceDark: messages?.appearanceDark ?? enGB.appearanceDark,
        appearanceLight: messages?.appearanceLight ?? enGB.appearanceLight,
        loading: messages?.loading ?? enGB.loading,
      },
      resolvedAppearance,
      setAppearance,
    }),
    [
      appearance,
      getMessageLocale,
      locale,
      messages,
      resolvedAppearance,
      setAppearance,
    ],
  );

  return (
    <I18nProvider locale={locale}>
      <BreezeContext value={context}>
        <BreezeRoot>{children}</BreezeRoot>
      </BreezeContext>
    </I18nProvider>
  );
}
