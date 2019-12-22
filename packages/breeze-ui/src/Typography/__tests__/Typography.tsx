import { render } from '@testing-library/react';
import React from 'react';
import Typography from '../Typography';

describe('Typography', () => {
  describe('component', () => {
    it('should render an h1 element', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h1');
    });

    it('should render an h2 element', async () => {
      const { findByText } = render(
        <Typography component="h2" variant="h2">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h2');
    });

    it('should render an h3 element', async () => {
      const { findByText } = render(
        <Typography component="h3" variant="h3">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h3');
    });

    it('should render an h4 element', async () => {
      const { findByText } = render(
        <Typography component="h4" variant="h4">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h4');
    });

    it('should render an h5 element', async () => {
      const { findByText } = render(
        <Typography component="h5" variant="h5">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h5');
    });

    it('should render an h6 element', async () => {
      const { findByText } = render(
        <Typography component="h6" variant="h6">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('h6');
    });

    it('should render an p element', async () => {
      const { findByText } = render(
        <Typography component="p" variant="p">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toContainHTML('p');
    });
  });

  describe('variant', () => {
    it('should have the correct h1 styles', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 2.5rem;',
      );
    });

    it('should have the correct h2 styles', async () => {
      const { findByText } = render(
        <Typography component="h2" variant="h2">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 2rem;',
      );
    });

    it('should have the correct h3 styles', async () => {
      const { findByText } = render(
        <Typography component="h3" variant="h3">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 1.75rem;',
      );
    });

    it('should have the correct h4 styles', async () => {
      const { findByText } = render(
        <Typography component="h4" variant="h4">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 1.5rem;',
      );
    });

    it('should have the correct h5 styles', async () => {
      const { findByText } = render(
        <Typography component="h5" variant="h5">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 1.25rem;',
      );
    });

    it('should have the correct h6 styles', async () => {
      const { findByText } = render(
        <Typography component="h6" variant="h6">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'font-size: 1rem;',
      );
    });

    it('should have the correct p styles', async () => {
      const { findByText } = render(
        <Typography component="p" variant="p">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(`
        color: inherit;
        line-height: 1.5;
        margin: 0 0 1rem;
      `);
    });

    it('should have the correct lead styles', async () => {
      const { findByText } = render(
        <Typography component="p" variant="lead">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(`
        font-size: 1.25rem;
        font-weight: 300;
        line-height: 1.5;
      `);
    });
  });
});
