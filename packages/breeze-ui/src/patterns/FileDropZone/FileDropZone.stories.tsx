import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FileDropZone } from './FileDropZone';

const meta = {
  args: {
    accept: '.pdf,image/*',
    label: 'Add attachments',
    maxFiles: 4,
    maxSize: 5_000_000,
    onFilesAdded: fn(),
  },
  component: FileDropZone,
  title: 'Forms/FileDropZone',
} satisfies Meta<typeof FileDropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A labelled drop area and picker button with file type, size, and count limits. */
export const Default: Story = {};

/** Existing attachments count toward the total limit. */
export const WithExistingFiles: Story = {
  args: {
    currentFileCount: 2,
  },
};

/** Selecting a supported file reports accepted files through the semantic callback. */
export const ChooseAFile: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    await userEvent.click(canvas.getByRole('button', { name: 'Choose files' }));
    await userEvent.upload(
      input!,
      new File(['invoice'], 'invoice.pdf', { type: 'application/pdf' }),
    );

    await expect(canvas.getByRole('status')).toHaveTextContent('Added 1 file.');
    await expect(args.onFilesAdded).toHaveBeenCalledTimes(1);
  },
};
