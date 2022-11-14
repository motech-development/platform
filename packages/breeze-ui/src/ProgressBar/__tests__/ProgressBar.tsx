import { render } from '@testing-library/react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render the progress bar without a max value', async () => {
    const { container } = render(<ProgressBar progress={50} />);

    await Promise.resolve();

    expect(container).toBeInTheDocument();
  });

  it('should render the progress bar with a max value', async () => {
    const { container } = render(<ProgressBar max={80} progress={40} />);

    await Promise.resolve();

    expect(container).toBeInTheDocument();
  });
});
