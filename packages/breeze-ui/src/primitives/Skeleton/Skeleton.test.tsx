import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Skeleton, type SkeletonProps } from './Skeleton';

expectTypeOf<SkeletonProps>().not.toHaveProperty('className');
expectTypeOf<SkeletonProps>().not.toHaveProperty('style');
expectTypeOf<SkeletonProps['blockSize']>().toEqualTypeOf<
  number | string | undefined
>();
expectTypeOf<SkeletonProps['inlineSize']>().toEqualTypeOf<
  number | string | undefined
>();

describe('Skeleton', () => {
  it('announces an indeterminate loading region when labelled', () => {
    renderBreeze(
      <Skeleton
        blockSize="7.25rem"
        inlineSize="63%"
        label="Loading receipt preview"
        shape="rectangle"
      />,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Loading receipt preview' }),
    ).toBeInTheDocument();
  });

  it('is decorative when no loading label is supplied', () => {
    const { container } = renderBreeze(<Skeleton shape="text" />);

    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});
