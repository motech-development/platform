import { createContext, useContext } from 'react';

interface BreezeContextValue {
  locale: string;
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
