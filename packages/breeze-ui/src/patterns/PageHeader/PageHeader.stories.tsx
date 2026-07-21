import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../primitives/Button/Button';
import { Link } from '../../primitives/Link/Link';
import { ButtonGroup } from '../ButtonGroup/ButtonGroup';
import { PageHeader } from './PageHeader';

/**
 * Establishes one page heading with optional context, back navigation, and
 * responsive application-owned actions.
 *
 * @summary responsive page heading with context, back link, and actions
 */
const meta = {
  component: PageHeader,
  title: 'Patterns/Page Structure/PageHeader',
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

async function expectContentSizedBack(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const back = canvas.getByRole('link', { name: 'Back to projects' });
  const backSlot = back.closest<HTMLElement>('[data-page-header-back]');
  const heading = canvas.getByRole('heading', { name: 'Projects' });
  const header = heading.closest('header');
  const headingColumn = heading.parentElement?.parentElement;
  const view = canvasElement.ownerDocument.defaultView;

  await expect(backSlot).not.toBeNull();
  await expect(view?.getComputedStyle(backSlot!).justifySelf).toBe(
    'flex-start',
  );
  await expect(back.getBoundingClientRect().width).toBeCloseTo(
    backSlot!.getBoundingClientRect().width,
    1,
  );
  await expect(back.getBoundingClientRect().width).toBeLessThan(
    headingColumn?.getBoundingClientRect().width ?? 0,
  );
  await expect(backSlot!.getBoundingClientRect().width).toBeLessThan(
    header?.getBoundingClientRect().width ?? 0,
  );
  await expect(
    heading.getBoundingClientRect().top -
      backSlot!.getBoundingClientRect().bottom,
  ).toBe(24);
  await userEvent.tab();
  await expect(back).toHaveFocus();
}

async function expectResponsiveActionOrder(
  canvasElement: HTMLElement,
  compact: boolean,
) {
  const canvas = within(canvasElement);
  const actionGroup = canvas.getByRole('group', { name: 'Project actions' });
  const actionButtons = canvas.getAllByRole('button');
  const [secondaryAction, primaryAction] = actionButtons;
  const actionGroupBounds = actionGroup.getBoundingClientRect();
  const primaryBounds = primaryAction.getBoundingClientRect();
  const secondaryBounds = secondaryAction.getBoundingClientRect();

  await expect(actionButtons.map(({ textContent }) => textContent)).toEqual([
    'View archived',
    'Create project',
  ]);

  if (compact) {
    await expect(primaryBounds.top).toBeLessThan(secondaryBounds.top);
    await expect(primaryBounds.width).toBeCloseTo(actionGroupBounds.width, 1);
    await expect(secondaryBounds.width).toBeCloseTo(actionGroupBounds.width, 1);
  } else {
    await expect(secondaryBounds.left).toBeLessThan(primaryBounds.left);
    await expect(secondaryBounds.top).toBeCloseTo(primaryBounds.top, 1);
  }

  await expect(actionGroup.scrollWidth).toBeLessThanOrEqual(
    actionGroup.clientWidth,
  );
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );

  await userEvent.tab();
  await expect(secondaryAction).toHaveFocus();
  await userEvent.tab();
  await expect(primaryAction).toHaveFocus();
}

/**
 * Composes a content-sized back destination, page description, and ordered
 * action group in the default wide presentation without changing tab order.
 *
 * @summary wide page header with back navigation and ordered actions
 */
export const ActionsAndBack: Story = {
  args: {
    actions: (
      <ButtonGroup
        aria-label="Project actions"
        orientation={{ base: 'verticalReverse', sm: 'horizontal' }}
      >
        <Button appearance="outline">View archived</Button>
        <Button>Create project</Button>
      </ButtonGroup>
    ),
    back: <Link href="/projects">Back to projects</Link>,
    description: 'Review and manage active projects.',
    title: 'Projects',
  },
  play: async ({ canvasElement }) => {
    await expectContentSizedBack(canvasElement);
    await expectResponsiveActionOrder(canvasElement, false);
  },
};

/**
 * Uses the canonical compact viewport to stack full-width actions visually in
 * priority order while preserving the secondary-then-primary DOM and tab order.
 *
 * @summary compact page header with priority-stacked full-width actions
 */
export const ActionsAndBackCompact: Story = {
  ...ActionsAndBack,
  globals: { viewport: { value: 'mobile1' } },
  play: async ({ canvasElement }) => {
    await expectContentSizedBack(canvasElement);
    await expectResponsiveActionOrder(canvasElement, true);
  },
};

/**
 * Demonstrates the intermediate layout where one action remains content-sized
 * below the title block before the wide two-column arrangement takes effect.
 *
 * @summary medium-width page header with one content-sized action
 */
export const MediumAction: Story = {
  args: {
    actions: <Button>Open settings</Button>,
    description: 'Configure how this workspace behaves.',
    title: 'Workspace settings',
  },
  globals: { viewport: { value: 'tablet' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const action = within(canvasElement).getByRole('button', {
      name: 'Open settings',
    });
    const description = canvas.getByText(
      'Configure how this workspace behaves.',
    );
    const view = canvasElement.ownerDocument.defaultView;

    await expect(action.getBoundingClientRect().width).toBeLessThan(220);
    await expect(
      action.getBoundingClientRect().top -
        description.getBoundingClientRect().bottom,
    ).toBe(32);
    await expect(view?.getComputedStyle(description).lineHeight).toBe('22.4px');
  },
};
