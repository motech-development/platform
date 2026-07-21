import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import StoryConstraint from '../../../.storybook/StoryConstraint';
import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Body, Card, Description, Footer, Header, Root, Title } from './Card';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(Card.Body, { displayName: 'Card.Body' });
      Object.assign(Card.Description, { displayName: 'Card.Description' });
      Object.assign(Card.Footer, { displayName: 'Card.Footer' });
      Object.assign(Card.Header, { displayName: 'Card.Header' });
      Object.assign(Card.Root, { displayName: 'Card.Root' });
      Object.assign(Card.Title, { displayName: 'Card.Title' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Body,
    Description,
    Footer,
    Header,
    Title,
  },
  title: 'Data Display/Card',
} satisfies Meta<typeof Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Composes Header, Title, Description, Body, and Footer inside the article
 * root, demonstrating the complete card anatomy with two independently
 * semantic actions.
 *
 * @summary Complete semantic card anatomy with footer actions.
 */
export const Complete: Story = {
  args: { children: null },
  decorators: [
    (Story) => (
      <StoryConstraint size="bounded">
        <Story />
      </StoryConstraint>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('article')).toBeVisible();
    await expect(
      canvas.getByRole('heading', { name: 'Release summary' }),
    ).toBeVisible();
  },
  render: () => (
    <Card.Root>
      <Card.Header>
        <Card.Title>Release summary</Card.Title>
        <Card.Description>Updated a few moments ago</Card.Description>
      </Card.Header>
      <Card.Body>
        Domain-neutral content can be short, long, structured, or interactive.
      </Card.Body>
      <Card.Footer>
        <Button>Open details</Button>
        <Button variant="secondary">Dismiss</Button>
      </Card.Footer>
    </Card.Root>
  ),
};

/**
 * Compares a body-only card with a long-title and unbroken-content card to
 * verify optional regions, wrapping, and overflow containment.
 *
 * @summary Optional card regions and extreme content wrapping.
 */
export const ContentExtremes: Story = {
  args: { children: null },
  render: () => (
    <StoryConstraint size="bounded">
      <Stack gap="md">
        <Card.Root>
          <Card.Body>Body only</Card.Body>
        </Card.Root>
        <Card.Root>
          <Card.Header>
            <Card.Title>
              An intentionally long title that wraps without widening its
              container
            </Card.Title>
          </Card.Header>
          <Card.Body>
            pneumonoultramicroscopicsilicovolcanoconiosis@example.invalid
          </Card.Body>
        </Card.Root>
      </Stack>
    </StoryConstraint>
  ),
};
