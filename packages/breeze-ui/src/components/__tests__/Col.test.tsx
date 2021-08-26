import { render } from '@testing-library/react';
import Col from '../Col';

describe('Col', () => {
  describe('xs', () => {
    it('should have the correct default styles', () => {
      const { container } = render(<Col>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when size is set', () => {
      const { container } = render(<Col xs={6}>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when size and offset is set', () => {
      const { container } = render(
        <Col xs={6} xsOffset={4}>
          Hello
        </Col>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('sm', () => {
    it('should have the correct styles when size is set', () => {
      const { container } = render(<Col sm={6}>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when size and offset is set', () => {
      const { container } = render(
        <Col sm={6} smOffset={4}>
          Hello
        </Col>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('md', () => {
    it('should have the correct styles when size is set', () => {
      const { container } = render(<Col md={6}>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when size and offset is set', () => {
      const { container } = render(
        <Col md={6} mdOffset={4}>
          Hello
        </Col>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('lg', () => {
    it('should have the correct styles when size is set', () => {
      const { container } = render(<Col lg={6}>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when size and offset is set', () => {
      const { container } = render(
        <Col lg={6} lgOffset={4}>
          Hello
        </Col>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('alignment', () => {
    it('should have the correct styles when alignment set to left', () => {
      const { container } = render(<Col align="left">Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when alignment set to right', () => {
      const { container } = render(<Col align="right">Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when alignment set to centre', () => {
      const { container } = render(<Col align="center">Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct styles when vertical alignment set to middle', () => {
      const { container } = render(<Col verticalAlign>Hello</Col>);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
