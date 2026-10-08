import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
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

/** One attachment-height row, as for a single invoice or receipt. */
export const Compact: Story = {
  args: {
    accept: '.pdf,.jpg,.png',
    camera: true,
    compact: true,
    label: 'Invoice or receipt',
    maxFiles: 1,
    maxSize: undefined,
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

/** Take photo opens the device camera, and the captured photo passes the same checks as a chosen file. */
export const TakePhoto: Story = {
  args: {
    accept: '.pdf,.jpg,.png',
    camera: true,
    label: 'Invoice or receipt',
    maxFiles: 1,
    maxSize: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvasElement.querySelector<HTMLInputElement>(
      'input[capture="environment"]',
    );
    const openCamera = spyOn(input!, 'click');

    await userEvent.click(canvas.getByRole('button', { name: 'Take photo' }));
    await expect(openCamera).toHaveBeenCalledOnce();

    await userEvent.upload(
      input!,
      new File(['photo'], 'image.jpg', { type: 'image/jpeg' }),
    );

    await expect(canvas.getByRole('status')).toHaveTextContent('Added 1 file.');
    await expect(args.onFilesAdded).toHaveBeenCalledTimes(1);
  },
};

const phoneParameters = {
  chromatic: { viewports: [375] },
  viewport: {
    options: {
      fileDropZonePhone: {
        name: 'FileDropZone phone',
        styles: { height: '812px', width: '375px' },
        type: 'mobile',
      },
    },
  },
};

async function setPhoneViewport() {
  if (!('__vitest_browser__' in globalThis)) return;

  const { page } = await import('vitest/browser');
  await page.viewport(375, 812);
}

/** On phones the drag-and-drop line is hidden and Take photo fills the row in the brand colour. */
export const Phone: Story = {
  args: TakePhoto.args,
  globals: { viewport: { value: 'fileDropZonePhone' } },
  parameters: phoneParameters,
  play: async ({ canvasElement }) => {
    await setPhoneViewport();

    const canvas = within(canvasElement);
    const takePhoto = canvas.getByRole('button', { name: 'Take photo' });
    const chooseFiles = canvas.getByRole('button', { name: 'Choose files' });

    await waitFor(() =>
      expect(
        canvas.getByText('Drop files here or choose files.'),
      ).not.toBeVisible(),
    );
    await expect(takePhoto).toHaveTextContent('Take photo');
    await expect(takePhoto.getBoundingClientRect().width).toBeGreaterThan(
      chooseFiles.getBoundingClientRect().width,
    );
    await expect(getComputedStyle(takePhoto).backgroundColor).not.toBe(
      getComputedStyle(chooseFiles).backgroundColor,
    );
  },
};

/** The compact row keeps its prompt on phones and reduces both actions to named icons. */
export const CompactPhone: Story = {
  args: Compact.args,
  globals: { viewport: { value: 'fileDropZonePhone' } },
  parameters: phoneParameters,
  play: async ({ canvasElement }) => {
    await setPhoneViewport();

    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(canvas.getByText('Take photo')).not.toBeVisible(),
    );
    await expect(canvas.getByText('Choose files')).not.toBeVisible();
    await expect(
      canvas.getByText('Drop files here or choose files.'),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Take photo' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Choose files' }),
    ).toBeVisible();
  },
};
