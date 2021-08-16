import { render } from '@testing-library/react';
import PageTitle from '../PageTitle';

describe('PageTitle', () => {
  it('should display only a title', () => {
    const { container } = render(<PageTitle title="Page title" />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('should render title and a sub title', () => {
    const { container } = render(
      <PageTitle title="Page title" subTitle="Sub title" />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  describe('theme', () => {
    it('should render primary theme styles', () => {
      const { container } = render(
        <PageTitle colour="primary" title="Page title" subTitle="Sub title" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render secondary theme styles', () => {
      const { container } = render(
        <PageTitle
          colour="secondary"
          title="Page title"
          subTitle="Sub title"
        />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render success theme styles', () => {
      const { container } = render(
        <PageTitle colour="success" title="Page title" subTitle="Sub title" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render warning theme styles', () => {
      const { container } = render(
        <PageTitle colour="warning" title="Page title" subTitle="Sub title" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render danger theme styles', () => {
      const { container } = render(
        <PageTitle colour="danger" title="Page title" subTitle="Sub title" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
