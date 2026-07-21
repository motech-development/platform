import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import renderBreeze from '../../../test/render';
import { Drawer } from './Drawer';

describe('Drawer', () => {
  it('frames content with description-first chrome and a translated close action', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Drawer.Root>
        <Drawer.Trigger>Open details</Drawer.Trigger>
        <Drawer.Content chrome="soft">
          <Drawer.Title>Account details</Drawer.Title>
          <Drawer.Description>Review the account.</Drawer.Description>
          <p>Drawer body</p>
        </Drawer.Content>
      </Drawer.Root>,
    );

    await user.click(screen.getByRole('button', { name: 'Open details' }));
    const drawer = screen.getByRole('dialog', { name: 'Account details' });
    const description = screen.getByText('Review the account.');
    const title = screen.getByRole('heading', { name: 'Account details' });

    expect(description.closest('header')).toHaveClass(
      'bg-[var(--breeze-shell-soft)]',
    );
    expect(description.nextElementSibling).toBe(title);
    expect(drawer).toHaveClass('h-dvh');
    expect(drawer).toHaveClass('overflow-clip');
    expect(drawer).toHaveClass(
      'w-[min(var(--breeze-drawer-width),100vw)]',
      'max-w-[var(--breeze-drawer-width)]',
    );
    expect(drawer.parentElement?.parentElement).toHaveStyle(
      '--breeze-drawer-width: 36rem',
    );
    expect(screen.getByText('Drawer body')).toBeVisible();
    const headerClose = screen.getByRole('button', { name: 'Close' });

    expect(headerClose).toHaveFocus();
    await user.click(headerClose);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports controlled triggerless state and restores external focus', async () => {
    const user = userEvent.setup();

    function ControlledDrawer() {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Edit selected row
          </button>
          <Drawer.Root onOpenChange={setOpen} open={open} triggerless>
            <Drawer.Content size="medium">
              <Drawer.Title>Edit record</Drawer.Title>
              <Drawer.Description>
                Update the selected record.
              </Drawer.Description>
              <Drawer.Close>Save and close</Drawer.Close>
            </Drawer.Content>
          </Drawer.Root>
        </>
      );
    }

    renderBreeze(<ControlledDrawer />);

    const externalTrigger = screen.getByRole('button', {
      name: 'Edit selected row',
    });

    await user.click(externalTrigger);
    const drawer = screen.getByRole('dialog', { name: 'Edit record' });

    expect(drawer.parentElement?.parentElement).toHaveStyle(
      '--breeze-drawer-width: 38rem',
    );
    await user.click(screen.getByRole('button', { name: 'Save and close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(externalTrigger).toHaveFocus());

    await user.click(externalTrigger);
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(externalTrigger).toHaveFocus());
  });

  it('supports a nested drawer and restores focus one layer at a time', async () => {
    const user = userEvent.setup();

    renderBreeze(
      <Drawer.Root>
        <Drawer.Trigger>Open outer</Drawer.Trigger>
        <Drawer.Content placement={{ base: 'bottom', md: 'end' }} size="wide">
          <Drawer.Title>Outer drawer</Drawer.Title>
          <Drawer.Description>Outer content.</Drawer.Description>
          <Drawer.Root>
            <Drawer.Trigger>Open inner</Drawer.Trigger>
            <Drawer.Content
              adjacent={{ inlineEndOffset: 760 }}
              placement={{ base: 'bottom', md: 'end' }}
            >
              <Drawer.Title>Inner drawer</Drawer.Title>
              <Drawer.Description>Inner content.</Drawer.Description>
              <Drawer.Close>Close inner</Drawer.Close>
            </Drawer.Content>
          </Drawer.Root>
          <Drawer.Close>Close outer</Drawer.Close>
        </Drawer.Content>
      </Drawer.Root>,
    );
    const rootTrigger = screen.getByRole('button', { name: 'Open outer' });

    await user.click(rootTrigger);
    const outerDrawer = screen.getByRole('dialog');

    expect(outerDrawer).toHaveClass('breeze-drawer-surface');
    expect(outerDrawer.parentElement).toHaveClass('breeze-drawer-motion');
    expect(
      within(outerDrawer).getByRole('button', { name: 'Close' }),
    ).toHaveFocus();
    const nestedTrigger = screen.getByRole('button', { name: 'Open inner' });
    await user.click(nestedTrigger);

    expect(screen.getAllByRole('dialog', { hidden: true })).toHaveLength(2);
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    const nestedDrawer = screen.getByRole('dialog', { name: 'Inner drawer' });
    const nestedMotion = nestedDrawer.parentElement;
    const nestedOverlay = nestedMotion?.parentElement;

    expect(nestedDrawer).toHaveClass('breeze-drawer-adjacent-surface');
    expect(nestedMotion).toHaveClass('breeze-drawer-adjacent-motion');
    expect(nestedOverlay).toHaveClass('breeze-drawer-adjacent-overlay');
    expect(nestedOverlay).toHaveStyle(
      '--breeze-drawer-adjacent-inline-end: 760px',
    );
    expect(nestedOverlay).toHaveStyle('--breeze-drawer-width: 38rem');
    const nestedHeaderClose = within(nestedDrawer).getByRole('button', {
      name: 'Close',
    });

    expect(nestedHeaderClose).toHaveFocus();
    expect(nestedHeaderClose.firstElementChild).toHaveAttribute(
      'width',
      '1rem',
    );
    await user.keyboard('{Escape}');
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
    await waitFor(() => expect(nestedTrigger).toHaveFocus());
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(rootTrigger).toHaveFocus());
  });

  it('resets body scroll when multi-step content changes', async () => {
    const user = userEvent.setup();

    function StepDrawer() {
      const [step, setStep] = useState(1);

      return (
        <Drawer.Root>
          <Drawer.Trigger>Open wizard</Drawer.Trigger>
          <Drawer.Content scrollResetKey={step}>
            <Drawer.Title>Wizard</Drawer.Title>
            <Drawer.Description>Step {step} of 2</Drawer.Description>
            <button onClick={() => setStep(2)} type="button">
              Continue
            </button>
          </Drawer.Content>
        </Drawer.Root>
      );
    }

    renderBreeze(<StepDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open wizard' }));
    const drawer = screen.getByRole('dialog', { name: 'Wizard' });
    const body = drawer.querySelector<HTMLElement>(':scope > div');

    if (body !== null) {
      body.scrollTop = 200;
    }
    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => expect(body?.scrollTop).toBe(0));
  });
});
