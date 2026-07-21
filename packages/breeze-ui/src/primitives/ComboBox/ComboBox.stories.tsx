import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import type { CollectionKey } from '../../internal/types/collection';
import { Button } from '../Button/Button';
import { Inline } from '../Inline/Inline';
import { Item } from '../ListBox/ListBox';
import { Stack } from '../Stack/Stack';
import { Description, Error, Label } from '../TextField/TextField';
import {
  ComboBox,
  Group,
  Input,
  ListBox,
  Loading,
  OptionsError,
  Popover,
  Root,
  Trigger,
} from './ComboBox';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(ComboBox.Description, {
        displayName: 'ComboBox.Description',
      });
      Object.assign(ComboBox.Error, { displayName: 'ComboBox.Error' });
      Object.assign(ComboBox.Group, { displayName: 'ComboBox.Group' });
      Object.assign(ComboBox.Input, { displayName: 'ComboBox.Input' });
      Object.assign(ComboBox.Item, { displayName: 'ComboBox.Item' });
      Object.assign(ComboBox.Label, { displayName: 'ComboBox.Label' });
      Object.assign(ComboBox.ListBox, { displayName: 'ComboBox.ListBox' });
      Object.assign(ComboBox.Loading, { displayName: 'ComboBox.Loading' });
      Object.assign(ComboBox.OptionsError, {
        displayName: 'ComboBox.OptionsError',
      });
      Object.assign(ComboBox.Popover, { displayName: 'ComboBox.Popover' });
      Object.assign(ComboBox.Root, { displayName: 'ComboBox.Root' });
      Object.assign(ComboBox.Trigger, { displayName: 'ComboBox.Trigger' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error,
    Group,
    Input,
    Item,
    Label,
    ListBox,
    Loading,
    OptionsError,
    Popover,
    Trigger,
  },
  title: 'Collections/ComboBox',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function OptionParts() {
  return (
    <>
      <ComboBox.Label>Country</ComboBox.Label>
      <ComboBox.Group>
        <ComboBox.Input />
        <ComboBox.Trigger />
      </ComboBox.Group>
      <ComboBox.Popover>
        <ComboBox.ListBox>
          <ComboBox.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </ComboBox.Item>
          <ComboBox.Item id="fr" textValue="France">
            France
          </ComboBox.Item>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </>
  );
}

function DestinationParts() {
  return (
    <>
      <ComboBox.Label>Destination</ComboBox.Label>
      <ComboBox.Group>
        <ComboBox.Input />
        <ComboBox.Trigger />
      </ComboBox.Group>
      <ComboBox.Popover>
        <ComboBox.ListBox>
          <ComboBox.Item id={1} textValue="London">
            London
          </ComboBox.Item>
          <ComboBox.Item id={2} textValue="Lisbon">
            Lisbon
          </ComboBox.Item>
          <ComboBox.Item id={3} textValue="Lima">
            Lima
          </ComboBox.Item>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </>
  );
}

function ControlledModes() {
  const [country, setCountry] = useState<CollectionKey | null>('gb');
  const [countryInput, setCountryInput] = useState('United Kingdom');
  const [destination, setDestination] = useState<CollectionKey | null>(null);
  const [destinationInput, setDestinationInput] = useState('Lo');

  return (
    <Stack gap="md">
      <ComboBox.Root
        inputValue={countryInput}
        onInputChange={setCountryInput}
        onSelectionChange={setCountry}
        selection={country}
      >
        <OptionParts />
      </ComboBox.Root>
      <ComboBox.Root
        allowsCustomValue
        inputValue={destinationInput}
        onInputChange={setDestinationInput}
        onSelectionChange={setDestination}
        selection={destination}
      >
        <DestinationParts />
      </ComboBox.Root>
    </Stack>
  );
}

type AsyncStatus = 'error' | 'loading' | 'ready';

function AsyncSimulation() {
  const [status, setStatus] = useState<AsyncStatus>('loading');

  return (
    <Stack gap="compact">
      <Inline align="stretch" gap="sm" wrap={false}>
        <Button
          appearance="outline"
          onAction={() => setStatus('loading')}
          size="sm"
        >
          Loading
        </Button>
        <Button onAction={() => setStatus('ready')} size="sm">
          Supply options
        </Button>
        <Button
          appearance="outline"
          onAction={() => setStatus('error')}
          size="sm"
          variant="danger"
        >
          Fail options
        </Button>
      </Inline>
      <ComboBox.Root allowsCustomValue>
        <ComboBox.Label>Async destination</ComboBox.Label>
        <ComboBox.Group>
          <ComboBox.Input />
          <ComboBox.Trigger />
        </ComboBox.Group>
        <ComboBox.Popover>
          {status === 'loading' ? (
            <ComboBox.Loading>Loading destinations</ComboBox.Loading>
          ) : null}
          {status === 'error' ? (
            <ComboBox.OptionsError>
              Destinations unavailable
            </ComboBox.OptionsError>
          ) : null}
          <ComboBox.ListBox
            emptyContent={status === 'ready' ? 'No destinations' : null}
          >
            {status === 'ready' ? (
              <>
                <ComboBox.Item id={1} textValue="London">
                  London
                </ComboBox.Item>
                <ComboBox.Item id={2} textValue="Lisbon">
                  Lisbon
                </ComboBox.Item>
                <ComboBox.Item id={3} textValue="Lima">
                  Lima
                </ComboBox.Item>
              </>
            ) : null}
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
    </Stack>
  );
}

/**
 * Filters a selection-only country collection, opens the option list, and
 * commits an existing option so arbitrary input cannot become the selected
 * value.
 *
 * @summary selection-only filtering and option commit
 */
export const SelectionOnly: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox');

    await userEvent.type(input, 'Fra');
    await waitFor(async () => {
      const listBox = canvasElement.ownerDocument.getElementById(
        input.getAttribute('aria-controls') ?? '',
      );

      await expect(listBox).toBeVisible();
      await expect(
        within(listBox as HTMLElement).getByRole('option', { name: 'France' }),
      ).toBeVisible();
    });
    const listBox = canvasElement.ownerDocument.getElementById(
      input.getAttribute('aria-controls') ?? '',
    );

    await userEvent.click(
      within(listBox as HTMLElement).getByRole('option', { name: 'France' }),
    );
    await expect(input).toHaveValue('France');
  },
  render: () => (
    <ComboBox.Root>
      <ComboBox.Label>Country</ComboBox.Label>
      <ComboBox.Group>
        <ComboBox.Input />
        <ComboBox.Trigger />
      </ComboBox.Group>
      <ComboBox.Popover>
        <ComboBox.ListBox>
          <ComboBox.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </ComboBox.Item>
          <ComboBox.Item id="fr" textValue="France">
            France
          </ComboBox.Item>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </ComboBox.Root>
  ),
};

/**
 * Enables explicit free-form mode and commits typed destination text with
 * Enter when no option is highlighted, without requiring a matching collection
 * item.
 *
 * @summary free-form text commit without an option
 */
export const FreeFormValue: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox');

    await userEvent.type(input, 'Reykjavik{Enter}');
    await expect(input).toHaveValue('Reykjavik');
  },
  render: () => (
    <ComboBox.Root allowsCustomValue>
      <DestinationParts />
    </ComboBox.Root>
  ),
};

/**
 * Keeps option selection available in free-form mode by navigating suggestions
 * with ArrowDown and committing the highlighted collection item with Enter.
 *
 * @summary suggestion selection while free-form mode is enabled
 */
export const FreeFormOptionSelection: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('combobox');

    await userEvent.type(input, 'Li');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('London');
  },
  render: () => (
    <ComboBox.Root allowsCustomValue>
      <DestinationParts />
    </ComboBox.Root>
  ),
};

/**
 * Places both the selected key and displayed input text under application
 * control for selection-only and free-form combobox configurations.
 *
 * @summary controlled selection keys and input text
 */
export const ControlledSelectionAndInput: Story = {
  args: { children: null },
  render: () => <ControlledModes />,
};

/**
 * Simulates application-owned loading, ready, and error results while Breeze
 * announces status content and selects options supplied after the control
 * renders.
 *
 * @summary application-supplied asynchronous option states
 */
export const AsyncOptions: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Supply options' }),
    );
    const input = canvas.getByRole('combobox', {
      name: 'Async destination',
    });

    await userEvent.type(input, 'Li');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(input).toHaveValue('London');
  },
  render: () => <AsyncSimulation />,
};

/**
 * Compares disabled, immutable selection-only, invalid required, and immutable
 * free-form controls to make supported root states and guidance explicit.
 *
 * @summary disabled read-only invalid and required states
 */
export const States: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll<HTMLElement>(
      '[data-breeze-combobox-group]',
    );

    await expect(groups).toHaveLength(4);
    await expect(groups[0]).toHaveAttribute('data-disabled');
    await expect(groups[1]).toHaveAttribute('data-readonly');
    await expect(groups[2]).toHaveAttribute('data-invalid');
    await expect(groups[3]).toHaveAttribute('data-readonly');
  },
  render: () => (
    <Stack gap="md">
      <ComboBox.Root disabled>
        <OptionParts />
      </ComboBox.Root>
      <ComboBox.Root inputValue="France" readOnly selection="fr">
        <OptionParts />
      </ComboBox.Root>
      <ComboBox.Root invalid required>
        <OptionParts />
        <ComboBox.Description>Choose a supported country.</ComboBox.Description>
        <ComboBox.Error>A country is required.</ComboBox.Error>
      </ComboBox.Root>
      <ComboBox.Root allowsCustomValue inputValue="Anywhere" readOnly>
        <DestinationParts />
      </ComboBox.Root>
    </Stack>
  ),
};

/**
 * Documents the authored empty-content message shown when filtering removes
 * every available country from an otherwise populated option collection.
 *
 * @summary filtered collection empty-content presentation
 */
export const EmptyOptions: Story = {
  args: { children: null },
  render: () => (
    <ComboBox.Root>
      <ComboBox.Label>Country</ComboBox.Label>
      <ComboBox.Group>
        <ComboBox.Input />
        <ComboBox.Trigger />
      </ComboBox.Group>
      <ComboBox.Popover>
        <ComboBox.ListBox emptyContent="No countries">
          <ComboBox.Item id="gb" textValue="United Kingdom">
            United Kingdom
          </ComboBox.Item>
          <ComboBox.Item id="fr" textValue="France">
            France
          </ComboBox.Item>
        </ComboBox.ListBox>
      </ComboBox.Popover>
    </ComboBox.Root>
  ),
};

/**
 * Constrains a long label, placeholder, and wrapping option to a narrow host
 * while preserving the joined input-and-trigger geometry without horizontal
 * overflow.
 *
 * @summary long combobox content in a narrow host
 */
export const ContentExtreme: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector<HTMLElement>(
      '[data-breeze-combobox-group]',
    );
    const input = within(group as HTMLElement).getByRole('combobox');
    const trigger = within(group as HTMLElement).getByRole('button');

    await expect(group?.scrollWidth).toBe(group?.clientWidth);
    await expect(input.getBoundingClientRect().right).toBe(
      trigger.getBoundingClientRect().left,
    );
  },
  render: () => (
    <StoryConstraint size="narrow-control">
      <ComboBox.Root
        allowsCustomValue
        placeholder="Enter a destination anywhere in the world"
      >
        <ComboBox.Label>Long destination search label</ComboBox.Label>
        <ComboBox.Group>
          <ComboBox.Input />
          <ComboBox.Trigger />
        </ComboBox.Group>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="long" textValue="Long destination">
              A very long option label that wraps in narrow layouts
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
    </StoryConstraint>
  ),
};

/**
 * Compares all grouped control sizes and a right-to-left composition,
 * verifying that Group owns part sizing and reverses input-trigger placement
 * correctly.
 *
 * @summary grouped sizes and right-to-left control order
 */
export const SizesAndRightToLeft: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const groups = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        '[data-breeze-combobox-group]',
      ),
    );
    const heights = groups.map((element) =>
      Math.round(element.getBoundingClientRect().height),
    );

    await expect(heights[0]).toBeLessThan(heights[1]);
    await expect(heights[1]).toBeGreaterThanOrEqual(44);
    await expect(heights[2]).toBeGreaterThanOrEqual(heights[1]);
    await expect(heights[3]).toBe(heights[1]);
    await expect(
      within(canvasElement).queryByText('Open options'),
    ).not.toBeInTheDocument();

    await Promise.all(
      groups.map(async (element, index) => {
        const input = within(element).getByRole('combobox');
        const trigger = within(element).getByRole('button');
        const inputRect = input.getBoundingClientRect();
        const triggerRect = trigger.getBoundingClientRect();

        await expect(element.scrollWidth).toBe(element.clientWidth);
        await expect(getComputedStyle(input).borderWidth).toBe('0px');
        await expect(getComputedStyle(trigger).borderWidth).toBe('0px');

        if (index === groups.length - 1) {
          await expect(triggerRect.right).toBe(inputRect.left);
        } else {
          await expect(inputRect.right).toBe(triggerRect.left);
        }
      }),
    );
  },
  render: () => (
    <Stack gap="md">
      <ComboBox.Root placeholder="Small country">
        <ComboBox.Label>Small country</ComboBox.Label>
        <ComboBox.Group size="sm">
          <ComboBox.Input size="lg" />
          <ComboBox.Trigger size="lg" />
        </ComboBox.Group>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
            <ComboBox.Item id="fr" textValue="France">
              France
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <ComboBox.Root placeholder="Medium country">
        <ComboBox.Label>Medium country</ComboBox.Label>
        <ComboBox.Group size="md">
          <ComboBox.Input size="lg" />
          <ComboBox.Trigger size="lg" />
        </ComboBox.Group>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
            <ComboBox.Item id="fr" textValue="France">
              France
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <ComboBox.Root placeholder="Large country">
        <ComboBox.Label>Large country</ComboBox.Label>
        <ComboBox.Group size="lg">
          <ComboBox.Input size="sm" />
          <ComboBox.Trigger size="sm" />
        </ComboBox.Group>
        <ComboBox.Popover>
          <ComboBox.ListBox>
            <ComboBox.Item id="gb" textValue="United Kingdom">
              United Kingdom
            </ComboBox.Item>
            <ComboBox.Item id="fr" textValue="France">
              France
            </ComboBox.Item>
          </ComboBox.ListBox>
        </ComboBox.Popover>
      </ComboBox.Root>
      <div dir="rtl">
        <ComboBox.Root placeholder="Choose a country">
          <ComboBox.Label>RTL country</ComboBox.Label>
          <ComboBox.Group>
            <ComboBox.Input />
            <ComboBox.Trigger />
          </ComboBox.Group>
          <ComboBox.Popover>
            <ComboBox.ListBox>
              <ComboBox.Item id="gb" textValue="United Kingdom">
                United Kingdom
              </ComboBox.Item>
              <ComboBox.Item id="fr" textValue="France">
                France
              </ComboBox.Item>
            </ComboBox.ListBox>
          </ComboBox.Popover>
        </ComboBox.Root>
      </div>
    </Stack>
  ),
};
