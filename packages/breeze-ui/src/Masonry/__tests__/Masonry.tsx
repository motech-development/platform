import { render } from '@testing-library/react';
import React from 'react';
import Masonry from '../Masonry';

describe('Masonry', () => {
  let xs: number;
  let sm: number;
  let md: number;
  let lg: number;

  beforeEach(() => {
    xs = 1;
    sm = 2;
    md = 3;
    lg = 4;
  });

  describe('xs viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation(query => ({
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

    it('should output with a single child component', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      await expect(findByTestId('child-1')).resolves.toBeInTheDocument();
    });

    it('should output with a multiple child components', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      await expect(findByTestId('child-2')).resolves.toBeInTheDocument();
    });
  });

  describe('sm viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation(query => ({
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

    it('should output with a single child component', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      await expect(findByTestId('child-1')).resolves.toBeInTheDocument();
    });

    it('should output with a multiple child components', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      await expect(findByTestId('child-2')).resolves.toBeInTheDocument();
    });
  });

  describe('md viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation(query => ({
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

    it('should output with a single child component', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      await expect(findByTestId('child-1')).resolves.toBeInTheDocument();
    });

    it('should output with a multiple child components', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      await expect(findByTestId('child-2')).resolves.toBeInTheDocument();
    });
  });

  describe('lg viewport', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn().mockImplementation(query => ({
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

    it('should output with a single child component', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
        </Masonry>,
      );

      await expect(findByTestId('child-1')).resolves.toBeInTheDocument();
    });

    it('should output with a multiple child components', async () => {
      const { findByTestId } = render(
        <Masonry xs={xs} sm={sm} md={md} lg={lg}>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </Masonry>,
      );

      await expect(findByTestId('child-2')).resolves.toBeInTheDocument();
    });
  });
});
