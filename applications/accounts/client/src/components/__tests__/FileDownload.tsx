import { render } from '@testing-library/react';
import type { Mock } from 'vitest';
import FileDownload from '../FileDownload';

describe('FileDownload', () => {
  let onDownload: Mock;

  beforeEach(() => {
    onDownload = vi.fn().mockResolvedValue(null);
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
