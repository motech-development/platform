import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Link } from './Link';

describe('Link', () => {
  it('uses the router adapter for unmodified local navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(<Link href="/settings">Settings</Link>, {
      router: { navigate },
    });
    await user.click(screen.getByRole('link', { name: 'Settings' }));

    expect(navigate).toHaveBeenCalledWith('/settings');
  });

  it('retains native behavior for alternate targets', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(
      <Link href="/report" target="_blank">
        Report
      </Link>,
      {
        router: { navigate },
      },
    );
    await user.click(screen.getByRole('link', { name: 'Report' }));

    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('retains native behavior for external URLs and modified local clicks', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(
      <>
        <Link href="https://example.com">External</Link>
        <Link href="/settings">Settings</Link>
      </>,
      { router: { navigate } },
    );
    await user.click(screen.getByRole('link', { name: 'External' }));

    expect(navigate).not.toHaveBeenCalled();

    await user.keyboard('{Control>}');
    await user.click(screen.getByRole('link', { name: 'Settings' }));
    await user.keyboard('{/Control}');

    expect(navigate).not.toHaveBeenCalled();
  });

  it('renders disabled navigation semantics', () => {
    renderBreeze(
      <Link disabled href="/settings">
        Settings
      </Link>,
    );

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('treats download false as normal provider navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(
      <Link download={false} href="/report">
        Report
      </Link>,
      {
        router: { navigate },
      },
    );
    await user.click(screen.getByRole('link', { name: 'Report' }));

    expect(navigate).toHaveBeenCalledWith('/report');
  });

  it('forwards relevant native anchor attributes', () => {
    renderBreeze(
      <Link
        aria-controls="details"
        aria-labelledby="details-label"
        href="/details"
        id="details-link"
      >
        Details
      </Link>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('id', 'details-link');
    expect(link).toHaveAttribute('aria-controls', 'details');
    expect(link).toHaveAttribute('aria-labelledby', 'details-label');
  });
});
