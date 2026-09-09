import { describe, expect, it } from 'vitest';
import { BreezeProvider } from './BreezeProvider';

describe('BreezeProvider appearance props', () => {
  it('accepts controlled and uncontrolled appearance forms', () => {
    const controlled = (
      <BreezeProvider
        appearance="dark"
        locale="en-GB"
        onAppearanceChange={() => undefined}
      >
        Content
      </BreezeProvider>
    );
    const uncontrolled = (
      <BreezeProvider defaultAppearance="automatic" locale="en-GB">
        Content
      </BreezeProvider>
    );

    expect(controlled).toBeDefined();
    expect(uncontrolled).toBeDefined();
  });

  it('rejects mixed controlled and uncontrolled appearance props', () => {
    const mixed = (
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
