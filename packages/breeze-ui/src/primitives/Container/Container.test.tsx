import { screen } from '@testing-library/react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Container, type ContainerProps } from './Container';

expectTypeOf<ContainerProps>().not.toHaveProperty('className');
expectTypeOf<ContainerProps>().not.toHaveProperty('style');
expectTypeOf<ContainerProps['width']>().toEqualTypeOf<
  'page' | 'prose' | 'read' | undefined
>();

describe('Container', () => {
  it('provides a labelled page content boundary', () => {
    renderBreeze(
      <Container element="main" aria-label="Accounts">
        Page content
      </Container>,
    );

    expect(screen.getByRole('main', { name: 'Accounts' })).toHaveTextContent(
      'Page content',
    );
  });

  it('replaces unavailable content with an accessible placeholder', () => {
    renderBreeze(<Container loading>Container content</Container>);

    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeVisible();
    expect(screen.queryByText('Container content')).not.toBeInTheDocument();
  });
});
