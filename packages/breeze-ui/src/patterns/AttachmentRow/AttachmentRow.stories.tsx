import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { AttachmentRow, type AttachmentRowAction } from './AttachmentRow';

const actions = [
  {
    icon: 'download',
    id: 'download',
    label: 'Download',
  },
  {
    description: 'Choose a different attachment.',
    icon: 'upload',
    id: 'replace',
    label: 'Replace',
  },
  {
    icon: 'delete',
    id: 'remove',
    label: 'Remove',
  },
] satisfies AttachmentRowAction[];

const meta = {
  component: AttachmentRow,
  title: 'Files/AttachmentRow',
} satisfies Meta<typeof AttachmentRow>;

export default meta;
type Story = StoryObj<typeof meta>;

function ActionableDocumentExample() {
  const [status, setStatus] = useState('Uploaded');

  return (
    <AttachmentRow
      actions={actions}
      fileType="document"
      filename="fen-lane-garage-invoice.pdf"
      onAction={(action) => setStatus(`${action.label} started`)}
      onOpen={() => setStatus('Opened')}
      sizeBytes={84_000}
      status={status}
    />
  );
}

/** A document attachment with readable metadata and working file actions. */
export const Document: Story = {
  args: {
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    sizeBytes: 84_000,
    status: 'Uploaded',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', {
        name: 'More actions: fen-lane-garage-invoice.pdf',
      }),
    );
    await userEvent.click(
      await within(document.body).findByRole('menuitem', { name: 'Download' }),
    );
    await expect(canvas.getByText('Download started')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('button', {
        name: 'Open: fen-lane-garage-invoice.pdf',
      }),
    );
    await expect(canvas.getByText('Opened')).toBeVisible();
  },
  render: () => <ActionableDocumentExample />,
};

/** Shows file actions wrapping below the details in a narrow container. */
export const NarrowContainer: Story = {
  args: {
    actions,
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    onAction: () => {},
    onOpen: () => {},
    sizeBytes: 84_000,
    status: 'Uploaded',
  },
  play: async ({ canvasElement }) => {
    await document.fonts.ready;

    const canvas = within(canvasElement);
    const filename = canvas.getByText('fen-lane-garage-invoice.pdf');
    const content = filename.parentElement;
    const row = content?.parentElement;

    if (!content || !row) {
      throw new Error('The attachment row content was not rendered.');
    }

    const rowBounds = row.getBoundingClientRect();
    const contentBounds = content.getBoundingClientRect();
    const openBounds = canvas
      .getByRole('button', {
        name: 'Open: fen-lane-garage-invoice.pdf',
      })
      .getBoundingClientRect();
    const menuBounds = canvas
      .getByRole('button', {
        name: 'More actions: fen-lane-garage-invoice.pdf',
      })
      .getBoundingClientRect();

    await expect(openBounds.top).toBeGreaterThanOrEqual(contentBounds.bottom);
    await expect(menuBounds.top).toBeGreaterThanOrEqual(contentBounds.bottom);
    await expect(openBounds.right).toBeLessThanOrEqual(rowBounds.right);
    await expect(menuBounds.right).toBeLessThanOrEqual(rowBounds.right);
  },
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <ActionableDocumentExample />
    </div>
  ),
};

/** A photograph uses an image thumbnail when a URL is available. */
export const Photo: Story = {
  args: {
    fileType: 'photo',
    filename: 'IMG_4471.jpg',
    sizeBytes: 1_200_000,
    status: 'Uploaded',
    thumbnailUrl:
      'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22320%22 height=%22440%22 viewBox=%220 0 320 440%22%3E%3Crect width=%22320%22 height=%22440%22 fill=%22%23b5d8cf%22/%3E%3Cpath d=%22M0 330 110 180l95 110 50-70 65 110v110H0z%22 fill=%22%23699586%22/%3E%3Ccircle cx=%22235%22 cy=%22105%22 r=%2234%22 fill=%22%23f6d998%22/%3E%3C/svg%3E',
  },
};

/** A failed upload remains understandable through its visible status text. */
export const UploadFailed: Story = {
  args: {
    fileType: 'document',
    filename: 'fen-lane-garage-invoice.pdf',
    sizeBytes: 84_000,
    status: 'Upload failed',
  },
};

/** Shows the row shape while attachment details are unavailable. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};
