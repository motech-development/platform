import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  SharedOverlayClose as Close,
  SharedOverlayDescription as Description,
  SharedOverlayTitle as Title,
  SharedOverlayTrigger as Trigger,
} from '../../internal/react-aria/OverlayParts';
import { ButtonGroup } from '../../patterns/ButtonGroup/ButtonGroup';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Stack } from '../Stack/Stack';
import { Content, Popover, Root } from './Popover';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Popover.Close, { displayName: 'Popover.Close' });
      Object.assign(Popover.Content, { displayName: 'Popover.Content' });
      Object.assign(Popover.Description, {
        displayName: 'Popover.Description',
      });
      Object.assign(Popover.Root, { displayName: 'Popover.Root' });
      Object.assign(Popover.Title, { displayName: 'Popover.Title' });
      Object.assign(Popover.Trigger, { displayName: 'Popover.Trigger' });
      Object.assign(Select.Item, { displayName: 'Select.Item' });
      Object.assign(Select.Label, { displayName: 'Select.Label' });
      Object.assign(Select.ListBox, { displayName: 'Select.ListBox' });
      Object.assign(Select.Popover, { displayName: 'Select.Popover' });
      Object.assign(Select.Root, { displayName: 'Select.Root' });
      Object.assign(Select.Trigger, { displayName: 'Select.Trigger' });
      Object.assign(Select.Value, { displayName: 'Select.Value' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Close,
    Content,
    Description,
    Title,
    Trigger,
  },
  title: 'Primitives/Overlays/Popover',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

function NonmodalPopover() {
  return (
    <ButtonGroup>
      <Popover.Root>
        <Popover.Trigger>Show filters</Popover.Trigger>
        <Popover.Content placement="bottom start">
          <Popover.Title>Filters</Popover.Title>
          <Popover.Description>
            Optional controls remain nonmodal.
          </Popover.Description>
          <Stack gap="xl">
            <Select.Root defaultValue="any">
              <Select.Label>Status</Select.Label>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popover>
                <Select.ListBox>
                  <Select.Item id="any" textValue="Any">
                    Any
                  </Select.Item>
                  <Select.Item id="active" textValue="Active">
                    Active
                  </Select.Item>
                </Select.ListBox>
              </Select.Popover>
            </Select.Root>
            <ButtonGroup
              align="end"
              orientation={{ base: 'vertical', sm: 'horizontal' }}
            >
              <Popover.Close>Done</Popover.Close>
            </ButtonGroup>
          </Stack>
        </Popover.Content>
      </Popover.Root>
      <Button appearance="outline" data-popover-outside-target>
        Outside target
      </Button>
    </ButtonGroup>
  );
}

async function openNonmodalPopover(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const trigger = canvas.getByRole('button', { name: 'Show filters' });

  await userEvent.click(trigger);

  const body = within(canvasElement.ownerDocument.body);
  const popover = body.getByRole('dialog', { name: 'Filters' });

  await waitFor(() => expect(popover).toBeVisible());

  const popoverCanvas = within(popover);
  const select = popoverCanvas.getByRole('button', { name: /Status/ });
  const label = popoverCanvas.getByText('Status');
  const actions = popoverCanvas.getByRole('group');
  const done = within(actions).getByRole('button', { name: 'Done' });
  const indicator = select.querySelector('[data-breeze-select-indicator]');
  const selectStyle = getComputedStyle(select);
  const labelStyle = getComputedStyle(label);

  await expect(popover).toHaveAccessibleDescription(
    'Optional controls remain nonmodal.',
  );
  await expect(select).toHaveTextContent('Any');
  await expect(select.getBoundingClientRect().height).toBeGreaterThanOrEqual(
    44,
  );
  await expect(selectStyle.borderTopWidth).toBe('1px');
  await expect(selectStyle.fontFamily).toContain('Helvetica Neue');
  await expect(labelStyle.fontFamily).toContain('Cabin');
  await expect(labelStyle.fontWeight).toBe('700');
  await expect(select.getBoundingClientRect().width).toBe(
    select.parentElement!.getBoundingClientRect().width,
  );
  await expect(indicator).toBeVisible();
  await expect(indicator).toHaveAttribute('aria-hidden', 'true');
  await expect(
    actions.getBoundingClientRect().top - select.getBoundingClientRect().bottom,
  ).toBeCloseTo(24, 3);
  await expect(popover.scrollWidth).toBeLessThanOrEqual(popover.clientWidth);
  await expect(popover.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
  await expect(popover.getBoundingClientRect().right).toBeLessThanOrEqual(
    popover.ownerDocument.documentElement.clientWidth,
  );

  return { actions, done, popover, select, trigger };
}

async function selectActive(canvasElement: HTMLElement, select: HTMLElement) {
  await userEvent.click(select);

  const body = within(canvasElement.ownerDocument.body);
  const listbox = body.getByRole('listbox');
  const active = within(listbox).getByRole('option', { name: 'Active' });

  await expect(listbox).toBeVisible();
  await expect(
    within(listbox).getByRole('option', { name: 'Any' }),
  ).toBeVisible();
  await userEvent.click(active);
  await waitFor(() =>
    expect(body.queryByRole('listbox')).not.toBeInTheDocument(),
  );
  await expect(select).toHaveTextContent('Active');
  await expect(select).toHaveFocus();
}

async function expectDismissal(canvasElement: HTMLElement) {
  await waitFor(() =>
    expect(
      within(canvasElement.ownerDocument.body).queryByRole('dialog', {
        name: 'Filters',
      }),
    ).not.toBeInTheDocument(),
  );
}

async function dismissOutside(canvasElement: HTMLElement) {
  const outsideTarget = canvasElement.querySelector(
    '[data-popover-outside-target]',
  );

  if (!(outsideTarget instanceof HTMLElement)) {
    throw new Error('Outside dismissal target is missing.');
  }

  await userEvent.click(outsideTarget);
}

async function expectTriggerRestorationAfterDismissal(
  canvasElement: HTMLElement,
  trigger: HTMLElement,
) {
  await expectDismissal(canvasElement);
  await waitFor(() => expect(trigger).toHaveFocus());
}

/**
 * Opens a nonmodal filter popover, exercises its nested Select, verifies wide
 * action layout, and checks outside plus explicit dismissal paths.
 *
 * @summary nonmodal filter popover with outside dismissal
 */
export const NonmodalOutsideDismissal: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const { actions, select } = await openNonmodalPopover(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('row');
    await expect(actionsStyle.justifyContent).toBe('flex-end');
    await expect(
      within(actions)
        .getByRole('button', { name: 'Done' })
        .getBoundingClientRect().width,
    ).toBeLessThan(actions.getBoundingClientRect().width);
    await selectActive(canvasElement, select);

    await dismissOutside(canvasElement);
    await expectDismissal(canvasElement);

    const reopened = await openNonmodalPopover(canvasElement);

    await userEvent.click(reopened.done);
    await expectTriggerRestorationAfterDismissal(
      canvasElement,
      reopened.trigger,
    );
  },
  render: NonmodalPopover,
};
/**
 * Repeats the nonmodal filter workflow at the canonical compact viewport and
 * verifies the close action expands into a stacked layout.
 *
 * @summary compact nonmodal popover with full-width action
 */
export const NonmodalOutsideDismissalCompact: Story = {
  ...NonmodalOutsideDismissal,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    const { actions, done, select } = await openNonmodalPopover(canvasElement);
    const actionsStyle = getComputedStyle(actions);

    await expect(actionsStyle.flexDirection).toBe('column');
    await expect(done.getBoundingClientRect().width).toBe(
      actions.getBoundingClientRect().width,
    );
    await selectActive(canvasElement, select);

    await dismissOutside(canvasElement);
    await expectDismissal(canvasElement);

    const reopened = await openNonmodalPopover(canvasElement);

    await userEvent.click(reopened.done);
    await expectTriggerRestorationAfterDismissal(
      canvasElement,
      reopened.trigger,
    );
  },
};
/**
 * Keeps a modal popover immutably open to document contained outside
 * interaction, complete accessible anatomy, and an explicit close request.
 *
 * @summary read-only open modal popover anatomy
 */
export const ModalAndReadOnly: Story = {
  args: {
    children: (
      <>
        <Popover.Trigger>Persistent details</Popover.Trigger>
        <Popover.Content modal>
          <Popover.Title>Modal popover</Popover.Title>
          <Popover.Description>
            Outside interaction is contained.
          </Popover.Description>
          <Popover.Close>Request close</Popover.Close>
        </Popover.Content>
      </>
    ),
    open: true,
    readOnly: true,
  },
};
/**
 * Places long wrapping content at a preferred top-end position so automatic
 * collision handling and the viewport-bounded surface can be inspected.
 *
 * @summary long popover content with top-end placement
 */
export const PlacementExtremes: Story = {
  args: {
    children: (
      <>
        <Popover.Trigger>Long content</Popover.Trigger>
        <Popover.Content placement="top end">
          <Popover.Title>
            A long title that wraps within the constrained surface
          </Popover.Title>
          <Popover.Description>
            Positioning flips automatically when viewport space is constrained.
          </Popover.Description>
          <Popover.Close>Close</Popover.Close>
        </Popover.Content>
      </>
    ),
  },
};
