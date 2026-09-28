import { createContext, useContext } from 'react';
import type { ViewTransitionType } from '../motion/view-transitions';
import type enGB from './en-GB';

export type Appearance = 'automatic' | 'dark' | 'light';
export type ResolvedAppearance = Exclude<Appearance, 'automatic'>;

export interface RouterNavigationOptions {
  /** Transition types the router may use for the DOM commit. */
  transitionTypes: readonly ViewTransitionType[];
}

/** Optional same-document navigation adapter used by Breeze links. */
export interface BreezeRouter {
  /** Commits an application route; one-argument adapters remain compatible. */
  navigate: (href: string, options: RouterNavigationOptions) => void;
}

interface BreezeContextValue {
  appearance: Appearance;
  getMessageLocale: (message: keyof typeof enGB) => string;
  locale: string;
  messages: typeof enGB;
  router: BreezeRouter | undefined;
  resolvedAppearance: ResolvedAppearance;
  setAppearance: (appearance: Appearance) => void;
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
