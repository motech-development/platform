import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { I18nProvider, useLocale } from 'react-aria-components/I18nProvider';
import { BreezeContext } from './BreezeContext';

/** The required locale boundary for Breeze components. */
export interface BreezeProviderProps {
  children: ReactNode;
  /** BCP 47 locale for accessible interactions and future formatting components. */
  locale: string;
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
  children,
  locale,
}: Readonly<BreezeProviderProps>) {
  const context = useMemo(
    () => ({
      locale,
    }),
    [locale],
  );

  return (
    <I18nProvider locale={locale}>
      <BreezeContext value={context}>
        <BreezeRoot>{children}</BreezeRoot>
      </BreezeContext>
    </I18nProvider>
  );
}
