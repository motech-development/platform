import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Tabs } from './Tabs';

describe('Tabs', () => {
  it('changes uncontrolled selection with orientation-aware keyboard behavior', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Tabs.Root defaultValue={1} onChange={onChange} orientation="vertical">
        <Tabs.List aria-label="Settings">
          <Tabs.Tab id={1}>Profile</Tabs.Tab>
          <Tabs.Tab id="security">Security</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel id={1}>Profile panel</Tabs.Panel>
          <Tabs.Panel id="security">Security panel</Tabs.Panel>
        </Tabs.Panels>
      </Tabs.Root>,
    );
    screen.getByRole('tab', { name: 'Profile' }).focus();
    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('tab', { name: 'Security' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(onChange).toHaveBeenCalledWith('security');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Security panel');
  });

  it('keeps read-only controlled selection immutable', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Tabs.Root readOnly value="one">
        <Tabs.List aria-label="Read only">
          <Tabs.Tab id="one">One</Tabs.Tab>
          <Tabs.Tab id="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel id="one">One panel</Tabs.Panel>
        <Tabs.Panel id="two">Two panel</Tabs.Panel>
      </Tabs.Root>,
    );
    await user.click(screen.getByRole('tab', { name: 'Two' }));

    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });
});
