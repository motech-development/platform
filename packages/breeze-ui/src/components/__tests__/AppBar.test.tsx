import { render } from '@testing-library/react';
import AppBar from '../AppBar';

describe('AppBar', () => {
  describe('theme', () => {
    it('should render the secondary theme by default', () => {
      const { container } = render(
        <AppBar>
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the primary theme', () => {
      const { container } = render(
        <AppBar colour="primary">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the secondary theme', () => {
      const { container } = render(
        <AppBar colour="secondary">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the success theme', () => {
      const { container } = render(
        <AppBar colour="success">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the danger theme', () => {
      const { container } = render(
        <AppBar colour="danger">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the warning theme', () => {
      const { container } = render(
        <AppBar colour="warning">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('element', () => {
    it('should render as a nav element by default', () => {
      const { container } = render(
        <AppBar>
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('nav');

      expect(element).toBeInTheDocument();
    });

    it('should render as a header element', () => {
      const { container } = render(
        <AppBar element="header">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('header');

      expect(element).toBeInTheDocument();
    });

    it('should render as a div element', () => {
      const { container } = render(
        <AppBar element="div">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('div');

      expect(element).toBeInTheDocument();
    });

    it('should render as a nav element', () => {
      const { container } = render(
        <AppBar element="nav">
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('nav');

      expect(element).toBeInTheDocument();
    });
  });

  describe('position', () => {
    it('should be relative positioned by default', () => {
      const { container } = render(
        <AppBar>
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('nav');

      expect(element).toHaveClass('relative');
    });

    it('should be fixed position', () => {
      const { container } = render(
        <AppBar fixed>
          <div data-testid="content">Hello</div>
        </AppBar>,
      );
      const element = container.querySelector('nav');

      expect(element).toHaveClass('fixed top-0 left-0 w-full');
    });
  });

  it('should render the inner content', async () => {
    const { findByTestId } = render(
      <AppBar>
        <div data-testid="content">Hello</div>
      </AppBar>,
    );

    await expect(findByTestId('content')).resolves.toBeInTheDocument();
  });
});
