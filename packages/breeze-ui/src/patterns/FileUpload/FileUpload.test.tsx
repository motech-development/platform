import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { FileUpload } from './FileUpload';

function createDataTransfer(files: File[]) {
  return {
    dropEffect: 'none',
    effectAllowed: 'all',
    getData: () => '',
    items: files.map((file) => ({
      getAsFile: () => file,
      kind: 'file',
      type: file.type,
    })),
    types: ['Files'],
  };
}

describe('FileUpload', () => {
  it('presents the empty label and guidance', () => {
    renderBreeze(
      <FileUpload
        browseLabel="Browse files"
        guidance="PDF files, up to 10 MB"
        label="Drop files here"
        onFiles={() => undefined}
      />,
    );

    expect(screen.getByText('Drop files here')).toBeVisible();
    expect(screen.getByText('PDF files, up to 10 MB')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Browse files' })).toBeVisible();
  });

  it('reports browse selection and presents application-owned selected files', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const file = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });

    renderBreeze(
      <FileUpload
        acceptedFileTypes={['application/pdf']}
        browseLabel="Browse files"
        guidance="PDF files"
        label="No file selected"
        onFiles={onFiles}
        selectedFiles={[file]}
      />,
    );

    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    await user.upload(input as HTMLInputElement, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
    expect(screen.getByText('invoice.pdf')).toBeVisible();
  });

  it('reports browse rejections through both callbacks', () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const wrongType = new File(['notes'], 'notes.txt', {
      type: 'text/plain',
    });

    renderBreeze(
      <FileUpload
        acceptedFileTypes={['application/pdf']}
        browseLabel="Browse files"
        label="Drop files here"
        onFiles={onFiles}
        onReject={onReject}
      />,
    );

    const input = document.querySelector('input[type="file"]');

    expect(input).toBeInstanceOf(HTMLInputElement);
    if (!(input instanceof HTMLInputElement)) {
      throw new Error('Expected the native file input.');
    }

    fireEvent.change(input, {
      target: { files: [wrongType] },
    });

    expect(onFiles).toHaveBeenCalledWith([]);
    expect(onReject).toHaveBeenCalledWith([
      { file: wrongType, reasons: ['file-type'] },
    ]);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'notes.txt: File type is not accepted.',
    );
  });

  it('reports accepted and rejected dropped files', async () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const accepted = new File(['invoice'], 'invoice.pdf', {
      type: 'application/pdf',
    });
    const wrongType = new File(['notes'], 'notes.txt', {
      type: 'text/plain',
    });
    const dataTransfer = createDataTransfer([accepted, wrongType]);

    renderBreeze(
      <FileUpload
        acceptedFileTypes={['application/pdf']}
        allowsMultiple
        browseLabel="Browse files"
        label="Drop files here"
        onFiles={onFiles}
        onReject={onReject}
      />,
    );

    const dropZone = document.querySelector('[data-breeze-file-upload]');

    expect(dropZone).not.toBeNull();
    if (!(dropZone instanceof HTMLElement)) {
      throw new Error('Expected the file upload drop zone.');
    }

    fireEvent.dragEnter(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => expect(onFiles).toHaveBeenCalledWith([accepted]));
    expect(onReject).toHaveBeenCalledWith([
      { file: wrongType, reasons: ['file-type'] },
    ]);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'notes.txt: File type is not accepted.',
    );
  });
});
