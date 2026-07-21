import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { ApplicationShell } from './ApplicationShell';

describe('ApplicationShell', () => {
  it('provides skip navigation, shell slots, and an accessible compact drawer', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <ApplicationShell
        account={<span>Account</span>}
        brand={<strong>Product</strong>}
        compactBrand={<strong>Compact product</strong>}
        context={<span>Context</span>}
        navigation={<a href="/overview">Overview</a>}
        navigationLabel="Open navigation"
        skipLinkLabel="Skip to content"
      >
        <h1>Overview</h1>
      </ApplicationShell>,
    );

    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('main')).toHaveClass('py-6', 'sm:py-12');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open navigation' }));
    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeVisible();
    expect(dialog).toHaveClass('w-64');
    expect(dialog).toHaveClass('breeze-drawer-surface');
    expect(dialog.closest('.breeze-drawer-motion')).not.toBeNull();
    expect(screen.getByText('Compact product')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
