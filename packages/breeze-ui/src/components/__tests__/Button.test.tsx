import { render } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  describe('size', () => {
    it('should render when size is sm', () => {
      const { container } = render(<Button size="sm">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render when size is md', () => {
      const { container } = render(<Button>Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render when size is lg', () => {
      const { container } = render(<Button size="lg">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('theme', () => {
    it('should have the correct danger styles', () => {
      const { container } = render(<Button colour="danger">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct primary styles', () => {
      const { container } = render(<Button colour="primary">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct secondary styles', () => {
      const { container } = render(<Button colour="secondary">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct success styles', () => {
      const { container } = render(<Button colour="success">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct warning styles', () => {
      const { container } = render(<Button colour="warning">Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('block', () => {
    it('should not be displayed as a block element by default', () => {
      const { container } = render(<Button>Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not be displayed as a block element', () => {
      const { container } = render(<Button block={false}>Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should be displayed as an block element', () => {
      const { container } = render(<Button block>Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when sm', () => {
      const { container } = render(
        <Button block size="sm">
          Hello
        </Button>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when md', () => {
      const { container } = render(
        <Button block size="md">
          Hello
        </Button>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when lg', () => {
      const { container } = render(
        <Button block size="lg">
          Hello
        </Button>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('loading', () => {
    it('should render correctly when loading', () => {
      const { container } = render(<Button loading>Hello</Button>);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
