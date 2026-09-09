import { createContext, useContext } from 'react';
import type enGB from './en-GB';

export type Appearance = 'automatic' | 'dark' | 'light';
export type ResolvedAppearance = Exclude<Appearance, 'automatic'>;

interface BreezeContextValue {
  appearance: Appearance;
  getMessageLocale: (message: keyof typeof enGB) => string;
  locale: string;
  messages: typeof enGB;
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
