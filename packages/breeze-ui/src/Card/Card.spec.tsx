import { render } from '@testing-library/react';
import React from 'react';
import Card from './Card';

describe('Card', () => {
  it('should have the correct padding when set to "sm"', () => {
    const { container } = render(
      <Card padding="sm">
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    expect(container.firstChild).toHaveStyle('padding: 5px;');
  });

  it('should have the correct padding when set to "md"', () => {
    const { container } = render(
      <Card padding="md">
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    expect(container.firstChild).toHaveStyle('padding: 10px;');
  });

  it('should have the correct padding when set to "lg"', () => {
    const { container } = render(
      <Card padding="lg">
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    expect(container.firstChild).toHaveStyle('padding: 20px;');
  });

  it('should output child', async () => {
    const { findByTestId } = render(
      <Card padding="md">
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    await expect(findByTestId('content')).resolves.toBeDefined();
  });
});
