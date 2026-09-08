import { createContext, useContext } from 'react';
import type enGB from './en-GB';

interface BreezeContextValue {
  locale: string;
  messageLocale: string;
  messages: typeof enGB;
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
