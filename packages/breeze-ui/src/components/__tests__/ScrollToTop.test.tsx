import { fireEvent, render } from '@testing-library/react';
import Link from '../Link';
import ScrollToTop from '../ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('should scroll to the top of page when navigating', async () => {
    const { findByRole } = render(
      <>
        <ScrollToTop />

        <Link as="a" href="#test-page">
          Click me
        </Link>
      </>,
    );
    // TODO: Revert to link
    const link = await findByRole('link');

    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
