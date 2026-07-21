import {
  render,
  type RenderOptions,
  type RenderResult,
} from '@testing-library/react';
import type { ReactElement } from 'react';
import {
  BreezeProvider,
  type BreezeProviderProps,
} from '../src/provider/BreezeProvider';

type BreezeRenderProviderProps = Omit<
  BreezeProviderProps,
  'children' | 'locale'
> &
  Partial<Pick<BreezeProviderProps, 'locale'>>;

export default function renderBreeze(
  element: ReactElement,
  providerProps: BreezeRenderProviderProps = {},
  options?: RenderOptions,
): RenderResult {
  return render(
    <BreezeProvider
      direction={providerProps.direction}
      locale={providerProps.locale ?? 'en-GB'}
      messages={providerProps.messages}
      portalContainer={providerProps.portalContainer}
      router={providerProps.router}
      timeZone={providerProps.timeZone}
      toastLimit={providerProps.toastLimit}
    >
      {element}
    </BreezeProvider>,
    options,
  );
}
