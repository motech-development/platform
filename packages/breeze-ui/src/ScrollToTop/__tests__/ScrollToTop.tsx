import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Link from '../../Link/Link';
import ScrollToTop from '../ScrollToTop';

describe('ScrollToTop', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  it('should scroll to the top of page when navigating', async () => {
    const { findByRole } = render(
      <MemoryRouter>
        <ScrollToTop />

        <Link to="/test-page">Click me</Link>
      </MemoryRouter>,
    );
    const link = await findByRole('link');

    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
