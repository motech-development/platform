import { render } from '@testing-library/react';
import Container from '../Container';

describe('Container', () => {
  it('should render contents', async () => {
    const { findByTestId } = render(
      <Container>
        <div data-testid="content" />
      </Container>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });
});
