import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent } from 'storybook/test';
import { FileUpload } from './FileUpload';

const meta = {
  component: FileUpload,
  title: 'Patterns/Forms/FileUpload',
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Combines a focusable drop target and native browse control, validates the
 * authored file constraints, and reports accepted files without uploading.
 *
 * @summary keyboard-accessible browse and drop file selection
 */
export const BrowseAndDrop: Story = {
  args: {
    acceptedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    browseLabel: 'Browse',
    guidance: 'PDF, JPG or PNG',
    label: 'No file selected',
    onFiles: fn(),
  },
  play: async ({ args, canvas, canvasElement }) => {
    const upload = canvasElement.querySelector('[data-breeze-file-upload]');
    const browse = canvas.getByRole('button', { name: 'Browse' });
    const paperclip = upload?.querySelector('svg');
    const primaryLabel = canvas.getByText('No file selected');

    await expect(upload).not.toBeNull();
    await expect(paperclip).not.toBeNull();
    await expect(upload!.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      64,
    );
    await expect(browse.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    await expect(browse.getBoundingClientRect().width).toBeGreaterThan(
      browse.getBoundingClientRect().height,
    );
    await expect(paperclip!.getBoundingClientRect().x).toBeGreaterThan(
      upload!.getBoundingClientRect().x,
    );
    await expect(
      Number.parseFloat(getComputedStyle(primaryLabel).lineHeight),
    ).toBeCloseTo(22.4, 1);

    await userEvent.tab();
    await expect(upload).toHaveAttribute('data-focus-visible');
    await expect(getComputedStyle(upload!).outlineStyle).not.toBe('none');

    await userEvent.tab();
    await expect(browse).toHaveFocus();
    await expect(getComputedStyle(browse).outlineStyle).not.toBe('none');

    const file = new File(['example'], 'example.pdf', {
      type: 'application/pdf',
    });

    await userEvent.upload(
      canvasElement.querySelector('input[type="file"]')!,
      file,
    );
    await expect(args.onFiles).toHaveBeenCalledWith([file]);
  },
};

/**
 * Replaces the empty prompt with locale-aware selected file names while the
 * application retains the files and owns replacement or upload progress.
 *
 * @summary application-owned selected files with replacement action
 */
export const SelectedFiles: Story = {
  args: {
    browseLabel: 'Replace files',
    guidance: 'PDF, JPG or PNG',
    label: 'Add supporting files',
    onFiles: fn(),
    selectedFiles: [
      new File(['one'], 'brief.pdf', { type: 'application/pdf' }),
      new File(['two'], 'diagram.png', { type: 'image/png' }),
    ],
  },
};
