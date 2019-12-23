import { render } from '@testing-library/react';
import React from 'react';
import Window from '../Window';

describe('Window', () => {
  it('should render and display output', async () => {
    const { findByTestId } = render(
      <Window>
        <div data-testid="content" />
      </Window>,
    );

    await expect(findByTestId('content')).resolves.toBeDefined();
  });
});
