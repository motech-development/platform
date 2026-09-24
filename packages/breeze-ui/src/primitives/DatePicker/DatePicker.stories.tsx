import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { BreezeProvider } from '../../provider/BreezeProvider';
import type { IsoCalendarDate } from '../Typography/Typography';
import { DatePicker } from './DatePicker';

const meta = {
  args: {
    defaultValue: '2026-09-03',
    label: 'Transaction date',
  },
  component: DatePicker,
  title: 'Forms/DatePicker',
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A required date field with a localized long-form trigger. */
export const Default: Story = {};

/** A visible error marks the trigger invalid. */
export const Error: Story = {
  args: {
    error: 'Choose a transaction date.',
  },
};

/** A disabled date field cannot be opened or changed. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

function ControlledExample() {
  const [value, setValue] = useState<IsoCalendarDate>('2026-09-03');

  return (
    <div className="breeze-story-action">
      <DatePicker label="Transaction date" onChange={setValue} value={value} />
      <output>Current ISO date: {value}</output>
    </div>
  );
}

/** The application owns the selected date and receives an ISO value. */
export const Controlled: Story = {
  render: () => <ControlledExample />,
};

function ScrollingContainerExample() {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(
    null,
  );

  return (
    <div
      aria-label="Scrollable date picker example"
      ref={setPortalContainer}
      role="region"
      style={{ blockSize: '500px', overflowY: 'auto' }}
    >
      {portalContainer && (
        <BreezeProvider locale="en-GB" portalContainer={portalContainer}>
          <div aria-hidden="true" style={{ blockSize: '240px' }} />
          <DatePicker defaultValue="2026-09-03" label="Transaction date" />
          <div aria-hidden="true" style={{ blockSize: '240px' }} />
        </BreezeProvider>
      )}
    </div>
  );
}

/** Opening the calendar keeps its panel visible in a scrolling container. */
export const ScrollingContainer: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const page = within(canvasElement.ownerDocument.body);
    const container = canvas.getByRole('region', {
      name: 'Scrollable date picker example',
    });
    const trigger = within(container).getByRole('button', {
      name: 'Transaction date 3 September 2026',
    });

    await userEvent.click(trigger);

    const dialog = await page.findByRole('dialog', {
      name: 'Transaction date',
    });

    await waitFor(async () => {
      const containerRect = container.getBoundingClientRect();
      const dialogRect = dialog.getBoundingClientRect();

      await expect(container.scrollTop).toBeGreaterThan(0);
      await expect(dialogRect.top).toBeGreaterThanOrEqual(containerRect.top);
      await expect(dialogRect.bottom).toBeLessThanOrEqual(containerRect.bottom);
    });
  },
  render: () => <ScrollingContainerExample />,
};
