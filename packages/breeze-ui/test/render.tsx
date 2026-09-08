import { render, type RenderResult } from '@testing-library/react';
import type { ReactElement } from 'react';
import { BreezeProvider } from '../src/provider/BreezeProvider';

export default function renderBreeze(
  element: ReactElement,
  locale = 'en-GB',
): RenderResult {
  return render(<BreezeProvider locale={locale}>{element}</BreezeProvider>);
}
