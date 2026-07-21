import { createContext, useContext } from 'react';
import type { BreezeMessages } from './messages';

/** Reading direction applied to the Breeze component subtree. */
export type BreezeDirection = 'ltr' | 'rtl';

/** Router-neutral navigation contract used by link-capable Breeze components. */
export interface BreezeRouterAdapter {
  /** Performs client-side navigation to an application-owned URL. */
  navigate: (href: string) => void;
}

export interface BreezeContextValue {
  direction: BreezeDirection;
  locale: string;
  messages: BreezeMessages;
  portalContainer: HTMLElement | null;
  router: BreezeRouterAdapter | undefined;
  timeZone: string | undefined;
}

export const BreezeContext = createContext<BreezeContextValue | null>(null);

export function useBreezeContext(): BreezeContextValue {
  const context = useContext(BreezeContext);

  if (context === null) {
    throw new Error(
      'Breeze components must be rendered within BreezeProvider.',
    );
  }

  return context;
}
