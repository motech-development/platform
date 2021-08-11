import { render } from '@testing-library/react';
import Window from '../Window';

describe('Window', () => {
  it('should render contents', async () => {
    const { findByTestId } = render(
      <Window>
        <div data-testid="content" />
      </Window>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });
});
