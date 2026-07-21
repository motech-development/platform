import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { CheckIcon } from '../../icons';
import { Item, Root, Stepper } from './Stepper';

async function expectTitleAlignedWithIndicator(
  canvasElement: HTMLElement,
  title: string,
) {
  const titleElement = within(canvasElement).getByText(title);
  const item = titleElement.closest('li');
  const indicator = item?.querySelector<HTMLElement>('[aria-hidden="true"]');

  await expect(item).not.toBeNull();
  await expect(indicator).not.toBeNull();

  const indicatorBounds = indicator!.getBoundingClientRect();
  const titleBounds = titleElement.getBoundingClientRect();
  const indicatorCenter = indicatorBounds.top + indicatorBounds.height / 2;
  const titleCenter = titleBounds.top + titleBounds.height / 2;

  await expect(titleCenter).toBeCloseTo(indicatorCenter, 1);
}

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Stepper.Item, { displayName: 'Stepper.Item' });
      Object.assign(Stepper.Root, { displayName: 'Stepper.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: { Item },
  title: 'Progression/Stepper',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Presents completed, current, and upcoming stages in a wrapping horizontal
 * ordered list with the active stage exposed through current-step semantics.
 *
 * @summary horizontal completed current and upcoming steps
 */
export const Horizontal: Story = {
  args: {
    'aria-label': 'Example setup',
    children: (
      <>
        <Stepper.Item
          indicator={<CheckIcon />}
          status="complete"
          title="Details"
        />
        <Stepper.Item indicator="2" status="current" title="Settings" />
        <Stepper.Item indicator="3" status="upcoming" title="Review" />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await Promise.all(
      ['Details', 'Settings', 'Review'].map((title) =>
        expectTitleAlignedWithIndicator(canvasElement, title),
      ),
    );
  },
};

/**
 * Adds application-owned supporting descriptions to a vertical progression
 * while retaining aligned indicators and semantic ordered-list structure.
 *
 * @summary vertical steps with supporting descriptions
 */
export const VerticalWithDescriptions: Story = {
  args: {
    'aria-label': 'Example setup',
    children: (
      <>
        <Stepper.Item
          description="Registered identity and contact details."
          indicator={<CheckIcon />}
          status="complete"
          title="Details"
        />
        <Stepper.Item
          description="Preferences and opening values."
          indicator="2"
          status="current"
          title="Settings"
        />
      </>
    ),
    orientation: 'vertical',
  },
  play: async ({ canvasElement }) => {
    await Promise.all(
      ['Details', 'Settings'].map((title) =>
        expectTitleAlignedWithIndicator(canvasElement, title),
      ),
    );
  },
};
