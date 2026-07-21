import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import {
  Description,
  DescriptionList,
  Item,
  Root,
  Term,
} from './DescriptionList';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DescriptionList.Description, {
        displayName: 'DescriptionList.Description',
      });
      Object.assign(DescriptionList.Item, {
        displayName: 'DescriptionList.Item',
      });
      Object.assign(DescriptionList.Root, {
        displayName: 'DescriptionList.Root',
      });
      Object.assign(DescriptionList.Term, {
        displayName: 'DescriptionList.Term',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Item,
    Term,
  },
  title: 'Data Display/DescriptionList',
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Renders native term and description elements with a long value, stacking
 * pairs in narrow space and aligning them into columns when the host permits.
 *
 * @summary responsive native term-description pairs
 */
export const ResponsivePairs: Story = {
  args: { children: null },
  decorators: [
    (Story) => (
      <StoryConstraint size="bounded-content">
        <Story />
      </StoryConstraint>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Status').tagName).toBe('DT');
    await expect(canvas.getByText('Ready').tagName).toBe('DD');
  },
  render: () => (
    <DescriptionList.Root>
      <DescriptionList.Item>
        <DescriptionList.Term>Status</DescriptionList.Term>
        <DescriptionList.Description>Ready</DescriptionList.Description>
      </DescriptionList.Item>
      <DescriptionList.Item>
        <DescriptionList.Term>Reference</DescriptionList.Term>
        <DescriptionList.Description>
          A deliberately long value that wraps without obscuring its term
        </DescriptionList.Description>
      </DescriptionList.Item>
    </DescriptionList.Root>
  ),
};
