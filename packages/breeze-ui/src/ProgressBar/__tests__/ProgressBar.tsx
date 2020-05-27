import { render } from '@testing-library/react';
import React from 'react';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('should render the progress bar without a max value', async () => {
    const { container } = render(<ProgressBar progress={50} />);

    expect(container).toBeInTheDocument();
  });

  it('should render the progress bar with a max value', async () => {
    const { container } = render(<ProgressBar max={80} progress={40} />);

    expect(container).toBeInTheDocument();
  });
});
