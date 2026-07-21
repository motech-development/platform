import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import { FileTrigger } from '../FileTrigger/FileTrigger';
import {
  Description,
  DropZone,
  Error as DropZoneError,
  Feedback,
  Label,
  Root,
} from './DropZone';

function createDataTransfer(files: File[]): DataTransfer {
  const dataTransfer = new DataTransfer();

  files.forEach((file) => dataTransfer.items.add(file));
  Object.defineProperty(dataTransfer, 'items', {
    value: files.map((file) => ({
      getAsFile: () => file,
      kind: 'file',
      type: file.type,
    })),
  });

  return dataTransfer;
}

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(DropZone.Description, {
        displayName: 'DropZone.Description',
      });
      Object.assign(DropZone.Error, { displayName: 'DropZone.Error' });
      Object.assign(DropZone.Feedback, {
        displayName: 'DropZone.Feedback',
      });
      Object.assign(DropZone.Label, { displayName: 'DropZone.Label' });
      Object.assign(DropZone.Root, { displayName: 'DropZone.Root' });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Description,
    Error: DropZoneError,
    Feedback,
    Label,
  },
  title: 'Files/DropZone',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

function findDropZone(canvasElement: HTMLElement): HTMLDivElement {
  const label = within(canvasElement).getByText('Drop documents here');
  const root = label.parentElement;

  if (!(root instanceof HTMLDivElement)) {
    throw new Error('Expected the rendered drop-zone root.');
  }

  return root;
}

/**
 * Accepts a PDF through a synthetic native drop, exposes the active target
 * state, and forwards the successfully read file to the application callback.
 *
 * @summary accepted native drop and semantic file callback
 */
export const SyntheticDrop: Story = {
  args: { children: null, onFileReadError: fn(), onFiles: fn() },
  play: async ({ args, canvasElement }) => {
    const root = findDropZone(canvasElement);
    const dataTransfer = createDataTransfer([
      new File(['guide'], 'guide.pdf', { type: 'application/pdf' }),
    ]);

    await fireEvent.dragEnter(root, { dataTransfer });
    await waitFor(() =>
      expect(root).toHaveAttribute('data-drop-target', 'true'),
    );
    await fireEvent.drop(root, { dataTransfer });
    await waitFor(() => expect(args.onFiles).toHaveBeenCalledOnce());
    await expect(args.onFileReadError).not.toHaveBeenCalled();
  },
  render: (args) => (
    <DropZone.Root
      acceptedFileTypes={['application/pdf']}
      aria-label="Documents"
      onFileReadError={args.onFileReadError}
      onFiles={args.onFiles}
    >
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>PDF documents only.</DropZone.Description>
      <DropZone.Feedback />
    </DropZone.Root>
  ),
};

/**
 * Rejects a file that violates both type and size constraints and announces
 * the combined Breeze-owned rejection message in an alert.
 *
 * @summary combined file type and size rejection feedback
 */
export const RejectionFeedback: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ canvasElement }) => {
    const root = findDropZone(canvasElement);
    const dataTransfer = createDataTransfer([
      new File(['large text'], 'notes.txt', { type: 'text/plain' }),
    ]);

    await fireEvent.dragEnter(root, { dataTransfer });
    await fireEvent.drop(root, { dataTransfer });
    await waitFor(() =>
      expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
        'File type is not accepted. File exceeds the maximum size.',
      ),
    );
  },
  render: (args) => (
    <DropZone.Root
      acceptedFileTypes={['image/*']}
      aria-label="Documents"
      maxFileSize={4}
      onFiles={args.onFiles}
    >
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Feedback />
    </DropZone.Root>
  ),
};

/**
 * Enables a multiple-file drop boundary and provides persistent guidance plus
 * built-in feedback for application-owned batch workflows.
 *
 * @summary multiple-file drop configuration
 */
export const MultipleFiles: Story = {
  args: { children: null, onFiles: fn() },
  render: (args) => (
    <DropZone.Root allowsMultiple aria-label="Documents" onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>Multiple files are accepted.</DropZone.Description>
      <DropZone.Feedback />
    </DropZone.Root>
  ),
};

/**
 * Combines the drop affordance with a keyboard-operable file picker and
 * associates required guidance and invalid-state feedback with the target.
 *
 * @summary keyboard file-picker fallback with required invalid state
 */
export const KeyboardFallbackAndInvalidState: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ canvasElement }) => {
    const dropButton = within(canvasElement).getByRole('button', {
      name: /Required file/,
    });

    dropButton.focus();
    await expect(dropButton).toHaveFocus();
  },
  render: (args) => (
    <DropZone.Root
      aria-label="Required file"
      invalid
      onFiles={args.onFiles}
      required
    >
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>
        Drop a file, paste one, or use the file picker.
      </DropZone.Description>
      <FileTrigger.Root onFiles={args.onFiles}>
        <FileTrigger.Trigger>Choose files</FileTrigger.Trigger>
      </FileTrigger.Root>
      <DropZone.Error>A file is required.</DropZone.Error>
    </DropZone.Root>
  ),
};

/**
 * Prevents focus and file dropping while retaining a visible label and
 * explanation for why the file interaction is unavailable.
 *
 * @summary disabled drop target with persistent guidance
 */
export const Disabled: Story = {
  args: { children: null, onFiles: fn() },
  render: (args) => (
    <DropZone.Root aria-label="Documents" disabled onFiles={args.onFiles}>
      <DropZone.Label>Drop documents here</DropZone.Label>
      <DropZone.Description>File dropping is unavailable.</DropZone.Description>
    </DropZone.Root>
  ),
};
