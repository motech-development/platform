import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import LinkButton from '../LinkButton';

describe('LinkButton', () => {
  it('should link to the correct location', async () => {
    const { findByText } = render(
      <MemoryRouter>
        <LinkButton to="/test">Hello</LinkButton>
      </MemoryRouter>,
    );

    await expect(findByText('Hello')).resolves.toHaveAttribute('href', '/test');
  });

  describe('size', () => {
    it('should render when size is sm', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" size="sm">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        font-size: 16px;
        height: 32px;
        padding: 0 16px;
      `);
    });

    it('should render when size is md', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test">Hello</LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        font-size: 16px;
        height: 40px;
        padding: 0 24px;
      `);
    });

    it('should render when size is lg', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" size="lg">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        font-size: 18px;
        height: 46px;
        padding: 0 32px;
      `);
    });
  });

  describe('danger', () => {
    it('should have the correct styles', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" colour="danger">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(199,56,79);
        color: #fff;
      `);
    });
  });

  describe('primary', () => {
    it('should have the correct styles', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" colour="primary">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: #2e9dc8;
        color: #fff;
      `);
    });
  });

  describe('secondary', () => {
    it('should have the correct styles', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" colour="secondary">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: #f6f9fc;
        color: #333;
      `);
    });
  });

  describe('success', () => {
    it('should have the correct styles', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" colour="success">
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        background-color: rgb(0,128,93);
        color: #fff;
      `);
    });
  });

  describe('block', () => {
    it('should be displayed as an inline-block element by default', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test">Hello</LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle('display: inline-block;');
    });

    it('should be displayed as an inline-block element', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" block={false}>
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle('display: inline-block;');
    });

    it('should be displayed as an block element', () => {
      const { container } = render(
        <MemoryRouter>
          <LinkButton to="/test" block>
            Hello
          </LinkButton>
        </MemoryRouter>,
      );

      expect(container.firstChild).toHaveStyle(`
        display: block;
        width: 100%;
      `);
    });
  });
});
