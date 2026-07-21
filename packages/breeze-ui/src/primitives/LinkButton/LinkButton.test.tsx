import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('keeps link semantics while using provider navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(<LinkButton href="/new">Create record</LinkButton>, {
      router: { navigate },
    });
    await user.click(screen.getByRole('link', { name: 'Create record' }));

    expect(navigate).toHaveBeenCalledWith('/new');
  });

  it('retains native download behavior', () => {
    const navigate = vi.fn();

    renderBreeze(
      <LinkButton download href="/report.csv">
        Download
      </LinkButton>,
      {
        router: { navigate },
      },
    );

    expect(screen.getByRole('link')).toHaveAttribute('download');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('retains native behavior for external and alternate-target navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(
      <LinkButton href="https://example.com" target="_blank">
        External
      </LinkButton>,
      { router: { navigate } },
    );
    await user.click(screen.getByRole('link', { name: 'External' }));

    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('treats download false as normal provider navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    renderBreeze(
      <LinkButton download={false} href="/report">
        Report
      </LinkButton>,
      { router: { navigate } },
    );
    await user.click(screen.getByRole('link', { name: 'Report' }));

    expect(navigate).toHaveBeenCalledWith('/report');
  });

  it('forwards relevant native anchor attributes', () => {
    renderBreeze(
      <LinkButton
        aria-controls="details"
        aria-labelledby="details-label"
        href="/details"
        id="details-link-button"
      >
        Details
      </LinkButton>,
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('id', 'details-link-button');
    expect(link).toHaveAttribute('aria-controls', 'details');
    expect(link).toHaveAttribute('aria-labelledby', 'details-label');
  });

  it('renders disabled navigation semantics without an active anchor', () => {
    renderBreeze(
      <LinkButton disabled href="/details">
        Details
      </LinkButton>,
    );

    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('href');
  });
});
