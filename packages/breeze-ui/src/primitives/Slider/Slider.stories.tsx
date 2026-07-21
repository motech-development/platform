import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Stack } from '../Stack/Stack';
import {
  Description,
  Error as ErrorPart,
  Fill,
  Label,
  Output,
  Root,
  Slider,
  Thumb,
  Track as SliderTrack,
} from './Slider';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Slider.Description, {
        displayName: 'Slider.Description',
      });
      Object.assign(Slider.Error, { displayName: 'Slider.Error' });
      Object.assign(Slider.Fill, { displayName: 'Slider.Fill' });
      Object.assign(Slider.Label, { displayName: 'Slider.Label' });
      Object.assign(Slider.Output, { displayName: 'Slider.Output' });
      Object.assign(Slider.Root, { displayName: 'Slider.Root' });
      Object.assign(Slider.Thumb, { displayName: 'Slider.Thumb' });
      Object.assign(Slider.Track, { displayName: 'Slider.Track' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error: ErrorPart,
    Fill,
    Label,
    Output,
    Thumb,
    Track: SliderTrack,
  },
  title: 'Selection/Slider',
} satisfies Meta<typeof Root>;
export default meta;
type Story = StoryObj<typeof meta>;

interface TrackProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

function Track({ name = 'value', size }: TrackProps) {
  return (
    <Slider.Track>
      <Slider.Fill />
      <Slider.Thumb name={name} size={size} />
    </Slider.Track>
  );
}
function ControlledExample() {
  const [value, setValue] = useState(35);

  return (
    <Slider.Root onChange={setValue} value={value}>
      <Slider.Label>Controlled volume</Slider.Label>
      <Slider.Output />
      <Track />
      <Slider.Description>Value: {value}</Slider.Description>
    </Slider.Root>
  );
}

/**
 * Demonstrates an uncontrolled horizontal range with a visible label,
 * locale-formatted output, native form name, and associated guidance.
 *
 * @summary uncontrolled horizontal slider with keyboard stepping
 */
export const Horizontal: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole('slider', {
      name: 'Volume',
    });
    slider.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(slider).toHaveValue('25');
    await expect(slider).toHaveAccessibleDescription(
      'Use arrow keys or drag the thumb.',
    );
    const track = canvasElement.querySelector<HTMLElement>(
      '[data-breeze-slider-track]',
    );
    const thumb = slider.parentElement?.parentElement;

    if (!track || !thumb) {
      throw new Error('Expected the complete horizontal Slider anatomy.');
    }

    const trackBounds = track.getBoundingClientRect();
    const thumbBounds = thumb.getBoundingClientRect();
    const expectedThumbCenter = trackBounds.left + trackBounds.width * 0.25;

    await expect(
      Math.abs(thumbBounds.left + thumbBounds.width / 2 - expectedThumbCenter),
    ).toBeLessThanOrEqual(1);
  },
  render: () => (
    <Slider.Root defaultValue={20} max={100} min={0} step={5}>
      <Slider.Label>Volume</Slider.Label>
      <Slider.Output />
      <Slider.Track>
        <Slider.Fill />
        <Slider.Thumb name="volume" />
      </Slider.Track>
      <Slider.Description>Use arrow keys or drag the thumb.</Slider.Description>
    </Slider.Root>
  ),
};
/**
 * Keeps the numeric value in application state and reflects every semantic
 * change in supporting text beneath the slider.
 *
 * @summary application-controlled single slider value
 */
export const Controlled: Story = {
  args: { children: null },
  render: () => <ControlledExample />,
};
/**
 * Uses vertical geometry and verifies orientation-aware Arrow, Home, and End
 * key behaviour while keeping the label and output aligned.
 *
 * @summary vertical slider geometry and keyboard boundaries
 */
export const Vertical: Story = {
  args: { children: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const slider = canvas.getByRole('slider', { name: 'Level' });
    const label = canvas.getByText('Level');
    const output = canvas.getByText('5');
    const description = canvas.getByText('Choose a level.');
    const root = label.parentElement;
    const track = root?.querySelector<HTMLElement>(
      '[data-breeze-slider-track]',
    );
    const thumb = slider.parentElement?.parentElement;

    if (!root || !track || !thumb) {
      throw new Error('Expected the complete vertical Slider anatomy.');
    }

    const labelBounds = label.getBoundingClientRect();
    const outputBounds = output.getBoundingClientRect();
    const trackBounds = track.getBoundingClientRect();
    const initialThumbBounds = thumb.getBoundingClientRect();
    const descriptionBounds = description.getBoundingClientRect();
    const trackCenter = trackBounds.left + trackBounds.width / 2;

    await expect(root.getBoundingClientRect().height).toBeGreaterThan(256);
    await expect(labelBounds.height).toBeLessThan(30);
    await expect(outputBounds.height).toBeLessThan(30);
    await expect(
      Math.abs(labelBounds.top - outputBounds.top),
    ).toBeLessThanOrEqual(1);
    await expect(trackBounds.height).toBeCloseTo(256, 0);
    await expect(trackBounds.top).toBeGreaterThan(labelBounds.bottom);
    await expect(descriptionBounds.top).toBeGreaterThan(trackBounds.bottom);
    await expect(
      Math.abs(
        initialThumbBounds.left + initialThumbBounds.width / 2 - trackCenter,
      ),
    ).toBeLessThanOrEqual(1);
    await expect(
      Math.abs(
        trackBounds.left +
          trackBounds.width / 2 -
          (root.getBoundingClientRect().left +
            root.getBoundingClientRect().width / 2),
      ),
    ).toBeLessThanOrEqual(1);
    slider.focus();
    await userEvent.keyboard('{ArrowUp}{End}');
    await expect(slider).toHaveValue('10');
    const maximumThumbBounds = thumb.getBoundingClientRect();

    await expect(maximumThumbBounds.top).toBeGreaterThanOrEqual(
      trackBounds.top - 14,
    );
    await expect(maximumThumbBounds.bottom).toBeLessThanOrEqual(
      trackBounds.bottom + 14,
    );
    await expect(maximumThumbBounds.top).toBeGreaterThan(labelBounds.bottom);
    await expect(
      Math.abs(
        maximumThumbBounds.left + maximumThumbBounds.width / 2 - trackCenter,
      ),
    ).toBeLessThanOrEqual(1);

    await userEvent.keyboard('{Home}');
    await expect(slider).toHaveValue('0');
    const minimumThumbBounds = thumb.getBoundingClientRect();

    await expect(minimumThumbBounds.top).toBeGreaterThanOrEqual(
      trackBounds.top - 14,
    );
    await expect(minimumThumbBounds.bottom).toBeLessThanOrEqual(
      trackBounds.bottom + 14,
    );
    await expect(minimumThumbBounds.bottom).toBeLessThan(descriptionBounds.top);
    await expect(
      Math.abs(
        minimumThumbBounds.left + minimumThumbBounds.width / 2 - trackCenter,
      ),
    ).toBeLessThanOrEqual(1);
  },
  render: () => (
    <Slider.Root defaultValue={5} max={10} min={0} orientation="vertical">
      <Slider.Label>Level</Slider.Label>
      <Slider.Output />
      <Track />
      <Slider.Description>Choose a level.</Slider.Description>
    </Slider.Root>
  ),
};
/**
 * Compares immutable, disabled, and required invalid sliders while exercising
 * the supported thumb sizes and validation-message association.
 *
 * @summary read-only disabled and invalid slider states
 */
export const ReadOnlyAndStates: Story = {
  args: { children: null },
  render: () => (
    <Stack gap="xxl">
      <Slider.Root readOnly value={40}>
        <Slider.Label>Read-only</Slider.Label>
        <Slider.Output />
        <Track />
      </Slider.Root>
      <Slider.Root disabled defaultValue={50}>
        <Slider.Label>Disabled</Slider.Label>
        <Slider.Output />
        <Track size="sm" />
      </Slider.Root>
      <Slider.Root invalid required defaultValue={80}>
        <Slider.Label>Invalid</Slider.Label>
        <Slider.Output />
        <Track size="lg" />
        <Slider.Error>Choose an allowed value.</Slider.Error>
      </Slider.Root>
    </Stack>
  ),
};
/**
 * Constrains a large signed decimal range inside a narrow host to demonstrate
 * locale formatting, precision, long copy, and native form participation.
 *
 * @summary large decimal range and narrow content extreme
 */
export const FormattingAndExtremes: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="narrow-control">
      <Slider.Root
        defaultValue={999999.99}
        formatOptions={{ maximumFractionDigits: 2 }}
        max={1000000}
        min={-1000000}
        step={0.01}
      >
        <Slider.Label>A long bounded decimal range label</Slider.Label>
        <Slider.Output />
        <Track name="amount" />
        <Slider.Description>
          Large values remain locale-formatted while the native range input
          participates in forms.
        </Slider.Description>
      </Slider.Root>
    </StoryConstraint>
  ),
};
