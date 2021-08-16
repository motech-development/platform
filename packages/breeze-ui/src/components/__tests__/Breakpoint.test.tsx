import { render } from '@testing-library/react';
import Breakpoint from '../Breakpoint';

describe('Breakpoint', () => {
  it('should hide content in xs viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: false,
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { queryByTestId } = render(
      <Breakpoint xs={false}>
        <div data-testid="content" />
      </Breakpoint>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should hide content in sm viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query === '(min-width: 576px)',
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { queryByTestId } = render(
      <Breakpoint sm={false}>
        <div data-testid="content" />
      </Breakpoint>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should hide content in md viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query === '(min-width: 768px)',
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { queryByTestId } = render(
      <Breakpoint md={false}>
        <div data-testid="content" />
      </Breakpoint>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should hide content in lg viewport', () => {
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        addEventListener: jest.fn(),
        addListener: jest.fn(),
        dispatchEvent: jest.fn(),
        matches: query === '(min-width: 992px)',
        media: query,
        onchange: null,
        removeEventListener: jest.fn(),
        removeListener: jest.fn(),
      })),
      writable: true,
    });

    const { queryByTestId } = render(
      <Breakpoint lg={false}>
        <div data-testid="content" />
      </Breakpoint>,
    );

    expect(queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should show the content', () => {
    const { queryByTestId } = render(
      <Breakpoint>
        <div data-testid="content" />
      </Breakpoint>,
    );

    expect(queryByTestId('content')).toBeInTheDocument();
  });
});
