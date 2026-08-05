import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Link } from '../../primitives/Link/Link';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { ApplicationShell } from './ApplicationShell';

describe('ApplicationShell', () => {
  it('provides skip navigation, shell slots, and an accessible compact drawer', async () => {
    const user = userEvent.setup();
    const onCompactNavigationOpenChange = vi.fn();

    renderBreeze(
      <ApplicationShell
        account={<span>Account</span>}
        brand={<strong>Product</strong>}
        compactBrand={<strong>Compact product</strong>}
        context={<span>Context</span>}
        navigation={<a href="/overview">Overview</a>}
        navigationLabel="Open navigation"
        onCompactNavigationOpenChange={onCompactNavigationOpenChange}
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
    expect(onCompactNavigationOpenChange).toHaveBeenLastCalledWith(true);
    const dialog = screen.getByRole('dialog');

    expect(dialog).toBeVisible();
    expect(dialog).toHaveClass('w-64');
    expect(dialog).toHaveClass('breeze-drawer-surface');
    expect(dialog.closest('.breeze-drawer-motion')).not.toBeNull();
    expect(within(dialog).getByText('Context')).toBeVisible();
    expect(within(dialog).queryByText('Account')).not.toBeInTheDocument();
    expect(screen.getByText('Compact product')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onCompactNavigationOpenChange).toHaveBeenLastCalledWith(false);
    expect(onCompactNavigationOpenChange).toHaveBeenCalledTimes(2);
  });

  it('lets a controlled consumer close compact navigation after ordinary link navigation', async () => {
    const user = userEvent.setup();
    const navigate = vi.fn();

    function ControlledShell() {
      const [compactNavigationOpen, setCompactNavigationOpen] = useState(true);
      const [contentFocusKey, setContentFocusKey] = useState('/overview');

      return (
        <BreezeProvider
          locale="en-GB"
          router={{
            navigate: (href) => {
              navigate(href);
              setCompactNavigationOpen(false);
              setContentFocusKey(href);
            },
          }}
        >
          <ApplicationShell
            account={<span>Account</span>}
            brand={<strong>Product</strong>}
            compactNavigationOpen={compactNavigationOpen}
            contentFocusKey={contentFocusKey}
            navigation={
              <nav aria-label="Primary navigation">
                <Link href="/projects">Projects</Link>
                <Link href="/projects" target="_blank">
                  Open projects in a new tab
                </Link>
              </nav>
            }
            navigationLabel="Open navigation"
            onCompactNavigationOpenChange={setCompactNavigationOpen}
            skipLinkLabel="Skip to content"
          >
            <h1>Overview</h1>
          </ApplicationShell>
        </BreezeProvider>
      );
    }

    renderBreeze(<ControlledShell />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveFocus();
    const destination = within(dialog).getByRole('link', { name: 'Projects' });
    const newTabDestination = within(dialog).getByRole('link', {
      name: 'Open projects in a new tab',
    });

    expect(destination).toHaveAttribute('href', '/projects');
    destination.addEventListener('click', (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    });
    await user.keyboard('{Control>}');
    await user.click(destination);
    await user.keyboard('{/Control}');
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(newTabDestination).toHaveAttribute('target', '_blank');
    await user.click(newTabDestination);
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getByRole('dialog')).toBeVisible();
    await user.click(destination);
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/projects');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('main')).toHaveFocus());
  });
});
