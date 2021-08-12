import { render } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  describe('padding', () => {
    it('should have the correct padding when set to "sm"', () => {
      const { container } = render(
        <Card padding="sm">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when set to "md"', () => {
      const { container } = render(
        <Card padding="md">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when set to "lg"', () => {
      const { container } = render(
        <Card padding="lg">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when set to "none"', () => {
      const { container } = render(
        <Card padding="none">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('theme', () => {
    it('should set to "secondary" by default', () => {
      const { container } = render(
        <Card>
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct theme when set to "primary"', () => {
      const { container } = render(
        <Card theme="primary">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct theme when set to "secondary"', () => {
      const { container } = render(
        <Card theme="secondary">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct theme when set to "danger"', () => {
      const { container } = render(
        <Card theme="danger">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct theme when set to "success"', () => {
      const { container } = render(
        <Card theme="success">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct theme when set to "warning"', () => {
      const { container } = render(
        <Card theme="warning">
          <p data-testid="content">Hello world</p>
        </Card>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  it('should output child', async () => {
    const { findByTestId } = render(
      <Card>
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });

  it('should set correct custom classes', () => {
    const { container } = render(
      <Card className="my-custom-class">
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should set flexbox classes', () => {
    const { container } = render(
      <Card flex>
        <p data-testid="content">Hello world</p>
      </Card>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
