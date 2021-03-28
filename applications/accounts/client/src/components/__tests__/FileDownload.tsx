import { render } from '@testing-library/react';
import FileDownload from '../FileDownload';

describe('FileDownload', () => {
  let onDownload: jest.Mock;

  beforeEach(() => {
    onDownload = jest.fn();
  });

  it('should not download if it is still loading', () => {
    render(<FileDownload loading onDownload={onDownload} />);

    expect(onDownload).not.toHaveBeenCalled();
  });

  it('should download when not loading', () => {
    render(<FileDownload loading={false} onDownload={onDownload} />);

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
