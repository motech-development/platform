import { render } from '@testing-library/react';
import React from 'react';
import HelpText from '../HelpText';

describe('HelpText', () => {
  it('should have the correct small margin', async () => {
    const { findByText } = render(
      <HelpText error={false} spacing="sm">
        Hello world
      </HelpText>,
    );

    await expect(findByText('Hello world')).resolves.toHaveStyleRule(
      'margin-bottom',
      '5px',
    );
  });

  it('should have the correct medium margin', async () => {
    const { findByText } = render(
      <HelpText error={false} spacing="md">
        Hello world
      </HelpText>,
    );

    await expect(findByText('Hello world')).resolves.toHaveStyleRule(
      'margin-bottom',
      '10px',
    );
  });

  it('should have the correct large margin', async () => {
    const { findByText } = render(
      <HelpText error={false} spacing="lg">
        Hello world
      </HelpText>,
    );

    await expect(findByText('Hello world')).resolves.toHaveStyleRule(
      'margin-bottom',
      '20px',
    );
  });

  it('should have the correct styles', async () => {
    const { findByText } = render(
      <HelpText error={false} spacing="md">
        Hello world
      </HelpText>,
    );

    await expect(findByText('Hello world')).resolves.toHaveStyle(`
      color: #727272;
      font-size: 0.75rem;
    `);
  });

  it('should have the correct error colour text', async () => {
    const { findByText } = render(
      <HelpText error spacing="lg">
        Hello world
      </HelpText>,
    );

    await expect(findByText('Hello world')).resolves.toHaveStyleRule(
      'color',
      'rgb(199,56,79)',
    );
  });
});
