import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import { Toast, useToast } from './Toast';

const onAction = fn();

const meta = {
  args: {
    onDismiss: fn(),
    title: 'Notification',
  },
  component: Toast,
  title: 'Feedback/Toast',
} satisfies Meta<typeof Toast>;
export default meta;
type Story = StoryObj<typeof meta>;

function ActionToastDemo() {
  const toast = useToast();

  return (
    <Button
      onAction={() => {
        toast.show({
          action: {
            label: <Typography as="span">Undo upload</Typography>,
            onAction,
          },
          description: (
            <Typography as="span">The document is now available.</Typography>
          ),
          lifetime: null,
          title: <Typography as="span">Upload complete</Typography>,
          variant: 'success',
        });
      }}
    >
      Show notification
    </Button>
  );
}

function VariantToastDemo() {
  const toast = useToast();

  return (
    <Button
      onAction={() => {
        toast.show({
          lifetime: null,
          title: 'Primary notification',
          variant: 'primary',
        });
        toast.show({
          lifetime: null,
          title: 'Secondary notification',
          variant: 'secondary',
        });
        toast.show({
          lifetime: null,
          title: 'Success notification',
          variant: 'success',
        });
        toast.show({
          lifetime: null,
          title: 'Danger notification',
          variant: 'danger',
        });
        toast.show({
          lifetime: null,
          title: 'Warning notification',
          variant: 'warning',
        });
        toast.show({
          lifetime: null,
          title: 'Information notification',
          variant: 'info',
        });
        toast.show({
          lifetime: null,
          title: 'Light notification',
          variant: 'light',
        });
        toast.show({
          lifetime: null,
          title: 'Dark notification',
          variant: 'dark',
        });
      }}
    >
      Show all variants
    </Button>
  );
}

function QueueLimitDemo() {
  const toast = useToast();

  return (
    <Button
      onAction={() => {
        toast.show({ lifetime: null, title: 'First pending' });
        toast.show({ lifetime: null, title: 'Second visible' });
        toast.show({ lifetime: null, title: 'Third visible' });
      }}
    >
      Fill queue
    </Button>
  );
}

/**
 * Calls useToast below BreezeProvider, keeps the queued notification visible,
 * and verifies its application action is available from the live region.
 *
 * @summary provider-queued persistent toast with an application action
 */
export const ProviderQueueAndAction: Story = {
  play: async () => {
    const body = within(document.body);

    await userEvent.click(
      body.getByRole('button', { name: 'Show notification' }),
    );
    await expect(
      body.getByRole('alertdialog', { name: 'Upload complete' }),
    ).toBeInTheDocument();
    await userEvent.click(body.getByRole('button', { name: 'Undo upload' }));
    await expect(onAction).toHaveBeenCalled();
  },
  render: ActionToastDemo,
};

/**
 * Queues every supported semantic variant under a provider whose visible limit
 * is large enough to compare the complete notification palette.
 *
 * @summary complete semantic variant set in the provider queue
 */
export const Variants: Story = {
  decorators: [
    (Story) => (
      <BreezeProvider locale="en-GB" toastLimit={8}>
        <Story />
      </BreezeProvider>
    ),
  ],
  play: async () => {
    const body = within(document.body);

    await userEvent.click(
      body.getByRole('button', { name: 'Show all variants' }),
    );
    await expect(body.getAllByRole('alertdialog')).toHaveLength(8);
  },
  render: VariantToastDemo,
};

/**
 * Uses a provider limit of two and queues three persistent notifications to
 * demonstrate that the oldest visible toast is displaced by newer feedback.
 *
 * @summary provider queue enforcing a two-toast visible limit
 */
export const QueueLimit: Story = {
  play: async () => {
    const body = within(document.body);

    await userEvent.click(body.getByRole('button', { name: 'Fill queue' }));
    await expect(body.getAllByRole('alertdialog')).toHaveLength(2);
    await expect(body.queryByText('First pending')).not.toBeInTheDocument();
  },
  render: () => (
    <BreezeProvider locale="en-GB" toastLimit={2}>
      <QueueLimitDemo />
    </BreezeProvider>
  ),
};

/**
 * Renders one explicitly controlled standalone toast so an application-owned
 * notification source can avoid duplicating the provider queue announcement.
 *
 * @summary standalone controlled toast with one semantic owner
 */
export const StandaloneSemanticOwner: Story = {
  args: {
    description: 'One live interactive owner avoids duplicate announcements.',
    title: 'Controlled notification',
    variant: 'info',
  },
};
