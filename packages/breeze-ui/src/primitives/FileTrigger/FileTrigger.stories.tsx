import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test';
import { Stack } from '../Stack/Stack';
import { Feedback, FileTrigger, Root, Trigger } from './FileTrigger';

const meta = {
  component: Root,
  decorators: [
    (Story) => {
      Object.assign(FileTrigger.Feedback, {
        displayName: 'FileTrigger.Feedback',
      });
      Object.assign(FileTrigger.Root, { displayName: 'FileTrigger.Root' });
      Object.assign(FileTrigger.Trigger, {
        displayName: 'FileTrigger.Trigger',
      });

      return <Story />;
    },
  ] satisfies Decorator[],
  subcomponents: {
    Feedback,
    Trigger,
  },
  title: 'Files/FileTrigger',
} satisfies Meta<typeof Root>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Focuses the pressable trigger and selects an accepted PDF through the hidden
 * native input so the application receives the validated file.
 *
 * @summary keyboard-operable accepted file selection
 */
export const KeyboardSelection: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', { name: 'Choose document' });
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) {
      throw new Error('Expected the native file input.');
    }

    trigger.focus();
    await expect(trigger).toHaveFocus();
    await userEvent.upload(
      input,
      new File(['guide'], 'guide.pdf', { type: 'application/pdf' }),
    );
    await expect(args.onFiles).toHaveBeenCalledOnce();
  },
  render: (args) => (
    <FileTrigger.Root
      acceptedFileTypes={['application/pdf']}
      onFiles={args.onFiles}
    >
      <FileTrigger.Trigger>Choose document</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
  ),
};

/**
 * Selects a file that violates both accepted-type and maximum-size constraints
 * and announces the combined Breeze-owned rejection message.
 *
 * @summary file type and size rejection feedback
 */
export const TypeAndSizeFeedback: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ canvasElement }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]');

    if (!input) {
      throw new Error('Expected the native file input.');
    }

    await fireEvent.change(input, {
      target: {
        files: [new File(['too large'], 'notes.txt', { type: 'text/plain' })],
      },
    });
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'File type is not accepted. File exceeds the maximum size.',
    );
  },
  render: (args) => (
    <FileTrigger.Root
      acceptedFileTypes={['image/*', '.jpg']}
      maxFileSize={4}
      onFiles={args.onFiles}
    >
      <FileTrigger.Trigger>Choose image</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
  ),
};

/**
 * Submits a mixed native selection and verifies Breeze removes rejected files
 * from the browser-owned form value while retaining accepted files.
 *
 * @summary validated native form submission
 */
export const NativeFormSubmission: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ canvasElement }) => {
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    const form = canvasElement.querySelector<HTMLFormElement>('form');

    if (!input || !form) {
      throw new Error('Expected the native file input and form.');
    }

    const accepted = new File(['guide'], 'guide.pdf', {
      type: 'application/pdf',
    });
    const rejected = new File(['notes'], 'notes.txt', { type: 'text/plain' });
    const selectedFiles = new DataTransfer();

    selectedFiles.items.add(accepted);
    selectedFiles.items.add(rejected);
    input.files = selectedFiles.files;
    await fireEvent.change(input);

    await waitFor(() => expect(input).toHaveAttribute('name', 'documents'));
    await expect(input.files).toHaveLength(1);
    await expect(form.elements.namedItem('documents')).toBe(input);

    const submittedFiles = new FormData(form).getAll('documents');

    await expect(submittedFiles).toHaveLength(1);
    await expect((submittedFiles[0] as File).name).toBe('guide.pdf');
  },
  render: (args) => (
    <form aria-label="Document upload">
      <FileTrigger.Root
        acceptedFileTypes={['application/pdf']}
        allowsMultiple
        name="documents"
        onFiles={args.onFiles}
      >
        <FileTrigger.Trigger>Choose documents</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>
    </form>
  ),
};

/**
 * Submits an empty required picker and verifies native validation redirects
 * focus and invalid state to the visible keyboard-operable trigger.
 *
 * @summary required native validation focus
 */
export const RequiredValidation: Story = {
  args: { children: null, onFiles: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const form = canvasElement.querySelector<HTMLFormElement>('form');
    const input =
      canvasElement.querySelector<HTMLInputElement>('input[type="file"]');
    const trigger = canvas.getByRole('button', { name: 'Choose evidence' });

    if (!form || !input) {
      throw new Error('Expected the required native file input and form.');
    }

    const onSubmit = fn();

    form.addEventListener('submit', onSubmit);
    form.requestSubmit();

    await expect(onSubmit).not.toHaveBeenCalled();
    await expect(input).toBeInvalid();
    await expect(trigger).toHaveAttribute('aria-invalid', 'true');
    await expect(trigger).toHaveFocus();
  },
  render: (args) => (
    <form aria-label="Evidence upload">
      <FileTrigger.Root name="evidence" onFiles={args.onFiles} required>
        <FileTrigger.Trigger>Choose evidence</FileTrigger.Trigger>
      </FileTrigger.Root>
    </form>
  ),
};

/**
 * Enables native selection of more than one file while keeping accepted files,
 * upload transport, and subsequent processing application-owned.
 *
 * @summary multiple native file selection
 */
export const MultipleFiles: Story = {
  args: { children: null, onFiles: fn() },
  render: (args) => (
    <FileTrigger.Root allowsMultiple onFiles={args.onFiles}>
      <FileTrigger.Trigger>Choose documents</FileTrigger.Trigger>
      <FileTrigger.Feedback />
    </FileTrigger.Root>
  ),
};

/**
 * Compares a disabled picker with a required invalid directory and camera
 * configuration that participates in an external native form.
 *
 * @summary disabled directory capture and validation states
 */
export const NativeAndValidationStates: Story = {
  args: { children: null, onFiles: fn() },
  render: (args) => (
    <Stack gap="md">
      <FileTrigger.Root disabled onFiles={args.onFiles}>
        <FileTrigger.Trigger>Disabled selection</FileTrigger.Trigger>
      </FileTrigger.Root>
      <FileTrigger.Root
        acceptDirectory
        defaultCamera="environment"
        form="upload-form"
        invalid
        name="files"
        onFiles={args.onFiles}
        required
      >
        <FileTrigger.Trigger>Select a directory</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>
    </Stack>
  ),
};
