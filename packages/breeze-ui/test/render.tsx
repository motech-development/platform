import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import type { Appearance } from '../src/provider/BreezeContext';
import { BreezeProvider } from '../src/provider/BreezeProvider';

interface RenderProviderProps {
  defaultAppearance?: Appearance;
  onAppearanceChange?: (appearance: Appearance) => void;
}

export default function renderBreeze(
  element: ReactElement,
  locale = 'en-GB',
  providerProps: RenderProviderProps = {},
): RenderResult {
  const { defaultAppearance, onAppearanceChange } = providerProps;

  return render(
    <BreezeProvider
      defaultAppearance={defaultAppearance}
      locale={locale}
      onAppearanceChange={onAppearanceChange}
    >
      {element}
    </BreezeProvider>,
  );
}
