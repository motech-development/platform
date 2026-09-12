import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Inline, type InlineProps } from './Inline';

expectTypeOf<InlineProps>().not.toHaveProperty('className');
expectTypeOf<InlineProps>().not.toHaveProperty('style');
expectTypeOf<InlineProps['gap']>().toEqualTypeOf<
  0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | undefined
>();

describe('Inline', () => {
  it('groups content in the requested semantic element', () => {
    renderBreeze(
      <Inline element="nav" gap={2} aria-label="Actions">
        <span>Cancel</span>
        <span>Save</span>
      </Inline>,
    );

    expect(
      screen.getByRole('navigation', { name: 'Actions' }),
    ).toHaveTextContent('CancelSave');
  });

  it('gives a labelled default layout nameable semantics', () => {
    renderBreeze(<Inline aria-label="Actions">Save</Inline>);

    expect(screen.getByRole('group', { name: 'Actions' })).toHaveTextContent(
      'Save',
    );
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(
      <Inline loading justify="between">
        <span>Cancel</span>
        <span>Save</span>
      </Inline>,
    );

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.getAllByRole('progressbar', { hidden: true })).toHaveLength(
      2,
    );
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('announces loading when children are empty', () => {
    renderBreeze(<Inline loading>{null}</Inline>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
  });

  it('preserves the item count when children use fragments', () => {
    renderBreeze(
      <Inline loading>
        <>
          <span>Cancel</span>
          <span>Save</span>
          <span>Continue</span>
        </>
      </Inline>,
    );

    expect(screen.getAllByRole('progressbar', { hidden: true })).toHaveLength(
      3,
    );
  });
});
