import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  describe('primary', () => {
    it('should render the progress bar without a max value', async () => {
      const { container } = render(<ProgressBar progress={50} />);

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the progress bar with a max value', async () => {
      const { container } = render(
        <ProgressBar max={80} progress={40} theme="primary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('secondary', () => {
    it('should render the progress bar without a max value', async () => {
      const { container } = render(
        <ProgressBar progress={50} theme="secondary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the progress bar with a max value', async () => {
      const { container } = render(
        <ProgressBar max={80} progress={40} theme="secondary" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('success', () => {
    it('should render the progress bar without a max value', async () => {
      const { container } = render(
        <ProgressBar progress={50} theme="success" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the progress bar with a max value', async () => {
      const { container } = render(
        <ProgressBar max={80} progress={40} theme="success" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('warning', () => {
    it('should render the progress bar without a max value', async () => {
      const { container } = render(
        <ProgressBar progress={50} theme="warning" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the progress bar with a max value', async () => {
      const { container } = render(
        <ProgressBar max={80} progress={40} theme="warning" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });

  describe('danger', () => {
    it('should render the progress bar without a max value', async () => {
      const { container } = render(
        <ProgressBar progress={50} theme="danger" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });

    it('should render the progress bar with a max value', async () => {
      const { container } = render(
        <ProgressBar max={80} progress={40} theme="danger" />,
      );

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
