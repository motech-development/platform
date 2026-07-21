import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { UNSAFE_PortalProvider as AriaPortalProvider } from 'react-aria/PortalProvider';
import { I18nProvider } from 'react-aria-components/I18nProvider';
import { createPortal } from 'react-dom';
import { ToastProviderBoundary } from '../primitives/Toast/Toast';
import {
  BreezeContext,
  type BreezeContextValue,
  type BreezeDirection,
  type BreezeRouterAdapter,
} from './BreezeContext';
import { type BreezeMessageOverrides, resolveMessages } from './messages';

const rtlLanguages = new Set([
  'ar',
  'ckb',
  'dv',
  'fa',
  'he',
  'ku',
  'ps',
  'sd',
  'ug',
  'ur',
  'yi',
]);

type BreezeDatasetKey = 'breezePortalRoot' | 'breezeRoot';

/** Props for the required environment boundary shared by Breeze components. */
export interface BreezeProviderProps {
  /** Breeze components and application content rendered inside the boundary. */
  children: ReactNode;
  /** Reading direction override. Defaults to the direction inferred from `locale`. */
  direction?: BreezeDirection;
  /** BCP 47 locale used by Breeze formatting and accessible interactions. */
  locale: string;
  /** Partial replacements for the built-in `en-GB` generic messages. */
  messages?: BreezeMessageOverrides;
  /** Portal host for layered content. Defaults to a provider-owned host. */
  portalContainer?: HTMLElement | null;
  /** Optional router adapter used for internal client-side navigation. */
  router?: BreezeRouterAdapter;
  /** Optional IANA time-zone name used by date and time formatting components. */
  timeZone?: string;
  /** Maximum visible provider-scoped toasts before pending items queue. Defaults to `3`. */
  toastLimit?: number;
}

function inferDirection(locale: string): BreezeDirection {
  const { language } = new Intl.Locale(locale);

  return rtlLanguages.has(language) ? 'rtl' : 'ltr';
}

function restoreDatasetValue(
  element: HTMLElement,
  key: BreezeDatasetKey,
  value: string | undefined,
): void {
  const { dataset } = element;

  if (value === undefined) {
    delete dataset[key];

    return;
  }

  dataset[key] = value;
}

function restoreAttribute(
  element: HTMLElement,
  name: string,
  value: string | null,
): void {
  if (value === null) {
    element.removeAttribute(name);

    return;
  }

  element.setAttribute(name, value);
}

/**
 * Establishes the locale, direction, messages, routing, and portal environment
 * required by every Breeze component.
 *
 * @summary required environment boundary for every Breeze component
 */
export function BreezeProvider({
  children,
  direction,
  locale,
  messages: messageOverrides,
  portalContainer: suppliedPortalContainer,
  router,
  timeZone,
  toastLimit = 3,
}: Readonly<BreezeProviderProps>) {
  if (!Number.isInteger(toastLimit) || toastLimit < 1) {
    throw new RangeError(
      'BreezeProvider toastLimit must be a positive integer.',
    );
  }

  const [localPortalContainer, setLocalPortalContainer] =
    useState<HTMLDivElement | null>(null);
  const resolvedDirection = direction ?? inferDirection(locale);
  const messages = useMemo(
    () => resolveMessages(messageOverrides),
    [messageOverrides],
  );
  const portalContainer = suppliedPortalContainer ?? localPortalContainer;
  const portalContainerRef = useRef<HTMLElement | null>(portalContainer);

  portalContainerRef.current = portalContainer;

  const getPortalContainer = useCallback(() => portalContainerRef.current, []);
  const portalHost =
    suppliedPortalContainer === undefined && typeof document !== 'undefined'
      ? createPortal(
          <div
            data-breeze-portal-root=""
            data-breeze-root=""
            dir={resolvedDirection}
            lang={locale}
            ref={setLocalPortalContainer}
          />,
          document.body,
        )
      : null;

  useEffect(() => {
    if (
      suppliedPortalContainer === undefined ||
      suppliedPortalContainer === null
    ) {
      return undefined;
    }

    const { dataset: portalDataset } = suppliedPortalContainer;
    const previousPortalScope = portalDataset.breezePortalRoot;
    const previousRootScope = portalDataset.breezeRoot;
    const previousDirection = suppliedPortalContainer.getAttribute('dir');
    const previousLocale = suppliedPortalContainer.getAttribute('lang');

    portalDataset.breezePortalRoot = '';
    portalDataset.breezeRoot = '';
    suppliedPortalContainer.setAttribute('dir', resolvedDirection);
    suppliedPortalContainer.setAttribute('lang', locale);

    return () => {
      restoreDatasetValue(
        suppliedPortalContainer,
        'breezePortalRoot',
        previousPortalScope,
      );
      restoreDatasetValue(
        suppliedPortalContainer,
        'breezeRoot',
        previousRootScope,
      );
      restoreAttribute(suppliedPortalContainer, 'dir', previousDirection);
      restoreAttribute(suppliedPortalContainer, 'lang', previousLocale);
    };
  }, [locale, resolvedDirection, suppliedPortalContainer]);
  const context = useMemo<BreezeContextValue>(
    () => ({
      direction: resolvedDirection,
      locale,
      messages,
      portalContainer,
      router,
      timeZone,
    }),
    [locale, messages, portalContainer, resolvedDirection, router, timeZone],
  );

  return (
    <I18nProvider locale={locale}>
      <AriaPortalProvider getContainer={getPortalContainer}>
        <BreezeContext value={context}>
          <ToastProviderBoundary
            closeLabel={messages.close}
            limit={toastLimit}
            regionLabel={messages.notifications}
          >
            <div data-breeze-root="" dir={resolvedDirection} lang={locale}>
              {children}
            </div>
            {portalHost}
          </ToastProviderBoundary>
        </BreezeContext>
      </AriaPortalProvider>
    </I18nProvider>
  );
}
