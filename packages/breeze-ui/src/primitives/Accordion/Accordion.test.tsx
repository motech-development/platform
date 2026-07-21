import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('enforces single expansion by default and reports keys', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Accordion.Root defaultValue={[1]} onChange={onChange}>
        <Accordion.Item id={1}>
          <Accordion.Trigger>First</Accordion.Trigger>
          <Accordion.Panel>First panel</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="second">
          <Accordion.Trigger>Second</Accordion.Trigger>
          <Accordion.Panel>Second panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Second' }));

    expect(screen.getByText('First panel')).not.toBeVisible();
    expect(screen.getByText('Second panel')).toBeVisible();
    expect(onChange).toHaveBeenLastCalledWith(['second']);
  });

  it('supports multiple expanded items', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Accordion.Root defaultValue={['one']} multiple>
        <Accordion.Item id="one">
          <Accordion.Trigger>One</Accordion.Trigger>
          <Accordion.Panel>One panel</Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item id="two">
          <Accordion.Trigger>Two</Accordion.Trigger>
          <Accordion.Panel>Two panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>,
    );
    await user.click(screen.getByRole('button', { name: 'Two' }));

    expect(screen.getByText('One panel')).toBeVisible();
    expect(screen.getByText('Two panel')).toBeVisible();
  });
});
