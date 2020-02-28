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

  describe('alignment', () => {
    it('should align to the left by default', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'text-align: left;',
      );
    });

    it('should align to the left', async () => {
      const { findByText } = render(
        <Typography align="left" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'text-align: left;',
      );
    });

    it('should align to the right', async () => {
      const { findByText } = render(
        <Typography align="right" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'text-align: right;',
      );
    });

    it('should align to the centre', async () => {
      const { findByText } = render(
        <Typography align="center" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyle(
        'text-align: center;',
      );
    });
  });

  describe('margin', () => {
    it('should have the correct margin by default', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyleRule(
        'margin',
        '0 0 0.5rem',
      );
    });

    it('should have the correct margin when set to none', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1" margin="none">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyleRule(
        'margin',
        '0',
      );
    });

    it('should have the correct margin when set to sm', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1" margin="sm">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyleRule(
        'margin',
        '0 0 0.25rem',
      );
    });

    it('should have the correct margin when set to md', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1" margin="md">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyleRule(
        'margin',
        '0 0 0.5rem',
      );
    });

    it('should have the correct margin when set to lg', async () => {
      const { findByText } = render(
        <Typography component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      await expect(findByText('Hello world')).resolves.toHaveStyleRule(
        'margin',
        '0 0 1rem',
      );
    });
  });

  describe('rule', () => {
    it('should display a horizontal rule', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toBeInTheDocument();
    });

    it('should have the correct margin by default', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toHaveStyleRule(
        'margin',
        '0.5rem 0',
      );
    });

    it('should have the correct margin when set to none', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1" margin="none">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toHaveStyleRule(
        'margin',
        '0',
      );
    });

    it('should have the correct margin when set to sm', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1" margin="sm">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toHaveStyleRule(
        'margin',
        '0.25rem 0',
      );
    });

    it('should have the correct margin when set to md', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1" margin="md">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toHaveStyleRule(
        'margin',
        '0.5rem 0',
      );
    });

    it('should have the correct margin when set to lg', async () => {
      const { findByRole } = render(
        <Typography rule component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      await expect(findByRole('separator')).resolves.toHaveStyleRule(
        'margin',
        '1rem 0',
      );
    });

    it('should not display a horizontal rule', () => {
      const { queryByRole } = render(
        <Typography rule={false} component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(queryByRole('separator')).not.toBeInTheDocument();
    });

    it('should not display a horizontal rule by default', () => {
      const { queryByRole } = render(
        <Typography component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(queryByRole('separator')).not.toBeInTheDocument();
    });
  });
});
