import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { ContextSwitcher } from './ContextSwitcher';

const items = [
  { description: 'First context', id: 'first', name: 'First team' },
  { description: 'Second context', id: 'second', name: 'Second team' },
  {
    description: 'Caller-owned reserved-looking id',
    id: '__breeze-manage-contexts',
    name: 'Reserved team',
  },
];

describe('ContextSwitcher', () => {
  it('reports selected context values and management actions', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onManage = vi.fn();

    renderBreeze(
      <ContextSwitcher
        aria-label="Switch team"
        currentId="first"
        items={items}
        manageLabel="Manage teams"
        onChange={onChange}
        onManage={onManage}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Switch team' }));
    await user.click(
      screen.getByRole('menuitemradio', { name: /Second team/u }),
    );
    expect(onChange).toHaveBeenCalledWith('second');

    await user.click(screen.getByRole('button', { name: 'Switch team' }));
    await user.click(
      screen.getByRole('menuitemradio', { name: /Reserved team/u }),
    );
    expect(onChange).toHaveBeenCalledWith('__breeze-manage-contexts');

    await user.click(screen.getByRole('button', { name: 'Switch team' }));
    await user.click(
      screen.getByRole('menuitemradio', { name: 'Manage teams' }),
    );
    expect(onManage).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('presents an application-owned empty state when selection is required', () => {
    renderBreeze(
      <ContextSwitcher
        aria-label="Switch team"
        currentId={null}
        emptyIcon={<span data-testid="empty-context-icon">+</span>}
        emptyName="Select team"
        items={items}
        onChange={() => undefined}
        triggerLabel="Team"
      />,
    );

    const trigger = screen.getByRole('button', { name: 'Switch team' });

    expect(trigger).toHaveTextContent('Team');
    expect(trigger).toHaveTextContent('Select team');
    expect(screen.getByTestId('empty-context-icon')).toBeVisible();
  });
});
