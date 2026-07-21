import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { NavigationList } from './NavigationList';

describe('NavigationList', () => {
  it('supports vertical navigation with disabled and current items', async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();

    renderBreeze(
      <NavigationList.Root aria-label="Primary" orientation="vertical">
        <NavigationList.Item current href="/home" id="home" onAction={onAction}>
          Home
        </NavigationList.Item>
        <NavigationList.Item disabled href="/admin" id={2} onAction={onAction}>
          Admin
        </NavigationList.Item>
      </NavigationList.Root>,
      { router: { navigate: vi.fn() } },
    );
    await user.click(screen.getByText('Home'));
    await user.click(screen.getByText('Admin'));

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByText('Admin')).toHaveAttribute('aria-disabled', 'true');
    expect(onAction).toHaveBeenCalledOnce();
    expect(onAction).toHaveBeenCalledWith('home');
  });
});
