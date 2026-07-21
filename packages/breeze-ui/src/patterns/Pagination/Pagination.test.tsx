import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('reports requested pages and identifies the current page', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Pagination
        aria-label="Results pages"
        currentPage={4}
        onChange={onChange}
        pageCount={10}
      />,
    );

    expect(screen.getByLabelText('Page 4')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onChange).toHaveBeenCalledWith(5);
    await user.click(screen.getByRole('button', { name: 'Page 10' }));
    expect(onChange).toHaveBeenCalledWith(10);
  });

  it('disables navigation at the collection boundaries', () => {
    renderBreeze(
      <Pagination
        aria-label="Results pages"
        currentPage={1}
        onChange={vi.fn()}
        pageCount={1}
      />,
    );

    expect(
      screen.getByRole('button', { name: 'Previous page' }),
    ).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('renders a single skipped page instead of an ellipsis', () => {
    renderBreeze(
      <Pagination
        aria-label="Results pages"
        currentPage={4}
        onChange={vi.fn()}
        pageCount={10}
      />,
    );

    expect(screen.getByRole('button', { name: 'Page 2' })).toBeVisible();
    expect(screen.getAllByText('…')).toHaveLength(1);
  });

  it.each([0, 1.5, Number.POSITIVE_INFINITY])(
    'rejects invalid page counts: %s',
    (pageCount) => {
      expect(() =>
        renderBreeze(
          <Pagination
            aria-label="Results pages"
            currentPage={1}
            onChange={vi.fn()}
            pageCount={pageCount}
          />,
        ),
      ).toThrow('pageCount must be a positive integer.');
    },
  );

  it.each([0, 1.5, 3, Number.NaN])(
    'rejects current pages outside the page range: %s',
    (currentPage) => {
      expect(() =>
        renderBreeze(
          <Pagination
            aria-label="Results pages"
            currentPage={currentPage}
            onChange={vi.fn()}
            pageCount={2}
          />,
        ),
      ).toThrow('currentPage must be within the page range.');
    },
  );
});
