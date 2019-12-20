import { render } from '@testing-library/react';
import React from 'react';
import Button from '../Button';

describe('Button', () => {
  describe('size', () => {
    it('should render when size is sm', () => {
      const { container } = render(<Button size="sm">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        font-size: 16px;
        height: 32px;
        padding: 1px 16px;
      `);
    });

    it('should render when size is md', () => {
      const { container } = render(<Button>Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        font-size: 16px;
        height: 40px;
        padding: 1px 24px;
      `);
    });

    it('should render when size is lg', () => {
      const { container } = render(<Button size="lg">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        font-size: 18px;
        height: 48px;
        padding: 1px 32px;
      `);
    });
  });

  describe('danger', () => {
    it('should have the correct styles', () => {
      const { container } = render(<Button colour="danger">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(199,56,79);
        color: #fff;
      `);
    });
  });

  describe('primary', () => {
    it('should have the correct styles', () => {
      const { container } = render(<Button colour="primary">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        background-color: #2e9dc8;
        color: #fff;
      `);
    });
  });

  describe('secondary', () => {
    it('should have the correct styles', () => {
      const { container } = render(<Button colour="secondary">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        background-color: #f6f9fc;
        color: #333;
      `);
    });
  });

  describe('success', () => {
    it('should have the correct styles', () => {
      const { container } = render(<Button colour="success">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(0,128,93);
        color: #fff;
      `);
    });
  });
});
