import { render } from '@testing-library/react';
import { TColumn } from '../../utils/grid';
import Masonry from '../Masonry';

describe('Masonry', () => {
  let xs: TColumn;
  let sm: TColumn;
  let md: TColumn;
  let lg: TColumn;

  beforeEach(() => {
    xs = 1;
    sm = 2;
    md = 3;
    lg = 4;
  });

  describe('xs viewport', () => {
    beforeEach(() => {
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
    });

    it('should output with a single child component', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should output with a multiple child components', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('sm viewport', () => {
    beforeEach(() => {
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
    });

    it('should output with a single child component', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should output with a multiple child components', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('md viewport', () => {
    beforeEach(() => {
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
    });

    it('should output with a single child component', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should output with a multiple child components', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('lg viewport', () => {
    beforeEach(() => {
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
    });

    it('should output with a single child component', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should output with a multiple child components', () => {
      const { container } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
