import { render } from '@testing-library/react';
import Typography from '../Typography';

describe('Typography', () => {
  describe('component', () => {
    it('should render an h1 element', () => {
      const { container } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an h2 element', () => {
      const { container } = render(
        <Typography component="h2" variant="h2">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an h3 element', () => {
      const { container } = render(
        <Typography component="h3" variant="h3">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an h4 element', () => {
      const { container } = render(
        <Typography component="h4" variant="h4">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an h5 element', () => {
      const { container } = render(
        <Typography component="h5" variant="h5">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an h6 element', () => {
      const { container } = render(
        <Typography component="h6" variant="h6">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render an p element', () => {
      const { container } = render(
        <Typography component="p" variant="p">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('variant', () => {
    it('should have the correct h1 styles', () => {
      const { container } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct h2 styles', () => {
      const { container } = render(
        <Typography component="h2" variant="h2">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct h3 styles', () => {
      const { container } = render(
        <Typography component="h3" variant="h3">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct h4 styles', () => {
      const { container } = render(
        <Typography component="h4" variant="h4">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct h5 styles', () => {
      const { container } = render(
        <Typography component="h5" variant="h5">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct h6 styles', () => {
      const { container } = render(
        <Typography component="h6" variant="h6">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct p styles', () => {
      const { container } = render(
        <Typography component="p" variant="p">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct lead styles', () => {
      const { container } = render(
        <Typography component="p" variant="lead">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('alignment', () => {
    it('should align to the left by default', () => {
      const { container } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should align to the left', () => {
      const { container } = render(
        <Typography align="left" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should align to the right', () => {
      const { container } = render(
        <Typography align="right" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should align to the centre', () => {
      const { container } = render(
        <Typography align="center" component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('margin', () => {
    it('should have the correct margin by default', () => {
      const { container } = render(
        <Typography component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to none', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="none">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to sm', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="sm">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to md', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="md">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to lg', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('rule', () => {
    it('should display a horizontal rule', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin by default', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to none', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1" margin="none">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to sm', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1" margin="sm">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to md', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1" margin="md">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have the correct margin when set to lg', () => {
      const { container } = render(
        <Typography rule component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not display a horizontal rule', () => {
      const { container } = render(
        <Typography rule={false} component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should not display a horizontal rule by default', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('id', () => {
    it('should not have an id by default', () => {
      const { container } = render(
        <Typography component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should have an id if set', () => {
      const { container } = render(
        <Typography id="test" component="h1" variant="h1" margin="lg">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('break word', () => {
    it('should set the additional word break styles', () => {
      const { container } = render(
        <Typography breakWord component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('truncate', () => {
    it('should set the additional truncate styles', () => {
      const { container } = render(
        <Typography truncate component="h1" variant="h1">
          Hello world
        </Typography>,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
