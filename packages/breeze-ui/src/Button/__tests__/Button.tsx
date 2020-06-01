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
        padding: 0 16px;
      `);
    });

    it('should render when size is md', () => {
      const { container } = render(<Button>Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        font-size: 16px;
        height: 40px;
        padding: 0 24px;
      `);
    });

    it('should render when size is lg', () => {
      const { container } = render(<Button size="lg">Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        font-size: 18px;
        height: 46px;
        padding: 0 32px;
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
        background-color: #007fa8;
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

  describe('block', () => {
    it('should be displayed as an inline-block element by default', () => {
      const { container } = render(<Button>Hello</Button>);

      expect(container.firstChild).toHaveStyle('display: inline-block;');
    });

    it('should be displayed as an inline-block element', () => {
      const { container } = render(<Button block={false}>Hello</Button>);

      expect(container.firstChild).toHaveStyle('display: inline-block;');
    });

    it('should be displayed as an block element', () => {
      const { container } = render(<Button block>Hello</Button>);

      expect(container.firstChild).toHaveStyle(`
        display: block;
        padding: 0;
        width: 100%;
      `);
    });

    it('should have the correct padding when sm', () => {
      const { container } = render(
        <Button block size="sm">
          Hello
        </Button>,
      );

      expect(container.firstChild).toHaveStyle(`
        display: block;
        padding: 0;
        width: 100%;
      `);
    });

    it('should have the correct padding when md', () => {
      const { container } = render(
        <Button block size="md">
          Hello
        </Button>,
      );

      expect(container.firstChild).toHaveStyle(`
        display: block;
        padding: 0;
        width: 100%;
      `);
    });

    it('should have the correct padding when lg', () => {
      const { container } = render(
        <Button block size="lg">
          Hello
        </Button>,
      );

      expect(container.firstChild).toHaveStyle(`
        display: block;
        padding: 0;
        width: 100%;
      `);
    });
  });
});
