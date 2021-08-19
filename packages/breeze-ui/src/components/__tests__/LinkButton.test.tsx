import { render } from '@testing-library/react';
import LinkButton from '../LinkButton';

describe('LinkButton', () => {
  describe('size', () => {
    it('should render when size is sm', () => {
      const { container } = render(
        <LinkButton href="/somewhere" size="sm">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render when size is md', () => {
      const { container } = render(
        <LinkButton href="/somewhere">Hello</LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render when size is lg', () => {
      const { container } = render(
        <LinkButton href="/somewhere" size="lg">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('theme', () => {
    it('should have the correct danger styles', () => {
      const { container } = render(
        <LinkButton href="/somewhere" colour="danger">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct primary styles', () => {
      const { container } = render(
        <LinkButton href="/somewhere" colour="primary">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct secondary styles', () => {
      const { container } = render(
        <LinkButton href="/somewhere" colour="secondary">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct success styles', () => {
      const { container } = render(
        <LinkButton href="/somewhere" colour="success">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct warning styles', () => {
      const { container } = render(
        <LinkButton href="/somewhere" colour="warning">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('block', () => {
    it('should not be displayed as a block element by default', () => {
      const { container } = render(
        <LinkButton href="/somewhere">Hello</LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not be displayed as a block element', () => {
      const { container } = render(
        <LinkButton href="/somewhere" block={false}>
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should be displayed as an block element', () => {
      const { container } = render(
        <LinkButton block href="/somewhere">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when sm', () => {
      const { container } = render(
        <LinkButton block href="/somewhere" size="sm">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when md', () => {
      const { container } = render(
        <LinkButton block href="/somewhere" size="md">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct padding when lg', () => {
      const { container } = render(
        <LinkButton block href="/somewhere" size="lg">
          Hello
        </LinkButton>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
