import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from './BreezeProvider';

describe('BreezeProvider appearance props', () => {
  it('accepts controlled and uncontrolled appearance forms', () => {
    const controlled: ReactElement = (
      <BreezeProvider
        appearance="dark"
        locale="en-GB"
        onAppearanceChange={() => undefined}
      >
        Content
      </BreezeProvider>
    );
    const uncontrolled: ReactElement = (
      <BreezeProvider defaultAppearance="automatic" locale="en-GB">
        Content
      </BreezeProvider>
    );

    expect(controlled).toBeDefined();
    expect(uncontrolled).toBeDefined();
  });

  it('rejects mixed controlled and uncontrolled appearance props', () => {
    const mixed: ReactElement = (
      <BreezeProvider
        appearance="dark"
        // @ts-expect-error Controlled and uncontrolled appearance props are exclusive.
        defaultAppearance="light"
        locale="en-GB"
        onAppearanceChange={() => undefined}
      >
        Content
      </BreezeProvider>
    );

    expect(mixed).toBeDefined();
  });
});
