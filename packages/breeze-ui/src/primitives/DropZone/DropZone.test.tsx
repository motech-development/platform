import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { DropZone } from './DropZone';

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

describe('DropZone', () => {
  it('returns dropped native files through a semantic callback', async () => {
    const onFiles = vi.fn();
    const rootRef = createRef<HTMLDivElement>();
    const file = new File(['report'], 'report.pdf', {
      type: 'application/pdf',
    });
    const dataTransfer = createDataTransfer([file]);

    renderBreeze(
      <DropZone.Root aria-label="Report files" onFiles={onFiles} ref={rootRef}>
        <DropZone.Label>Drop reports here</DropZone.Label>
      </DropZone.Root>,
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    fireEvent.dragEnter(rootRef.current as HTMLDivElement, { dataTransfer });
    expect(rootRef.current).toHaveAttribute('data-drop-target', 'true');
    fireEvent.drop(rootRef.current as HTMLDivElement, { dataTransfer });

    await waitFor(() => expect(onFiles).toHaveBeenCalledWith([file]));
    expect(screen.getByText('Drop reports here')).toBeVisible();
  });

  it('accepts matching drops and presents type, size, and count feedback', async () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const rootRef = createRef<HTMLDivElement>();
    const accepted = new File(['pdf'], 'accepted.pdf', {
      type: 'application/pdf',
    });
    const wrongType = new File(['txt'], 'wrong.txt', { type: 'text/plain' });
    const tooLarge = new File(['large'], 'large.pdf', {
      type: 'application/pdf',
    });
    const extra = new File(['pdf'], 'extra.pdf', {
      type: 'application/pdf',
    });
    const dataTransfer = createDataTransfer([
      accepted,
      wrongType,
      tooLarge,
      extra,
    ]);

    renderBreeze(
      <DropZone.Root
        acceptedFileTypes={['application/pdf', '.docx']}
        aria-label="Documents"
        maxFileSize={4}
        onFiles={onFiles}
        onReject={onReject}
        ref={rootRef}
      >
        <DropZone.Label>Drop one document</DropZone.Label>
        <DropZone.Feedback />
      </DropZone.Root>,
    );

    fireEvent.dragEnter(rootRef.current as HTMLDivElement, { dataTransfer });
    fireEvent.drop(rootRef.current as HTMLDivElement, { dataTransfer });

    await waitFor(() => expect(onFiles).toHaveBeenCalledWith([accepted]));
    expect(onReject).toHaveBeenCalledWith([
      { file: wrongType, reasons: ['file-count', 'file-type'] },
      { file: tooLarge, reasons: ['file-count', 'file-size'] },
      { file: extra, reasons: ['file-count'] },
    ]);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'wrong.txt: Only one file may be selected. File type is not accepted.',
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'large.pdf: Only one file may be selected. File exceeds the maximum size.',
    );
  });

  it('exposes disabled, required, invalid, description, error, and keyboard state', () => {
    const onFiles = vi.fn();
    const rootRef = createRef<HTMLDivElement>();
    const file = new File(['file'], 'file.txt', { type: 'text/plain' });
    const dataTransfer = createDataTransfer([file]);

    renderBreeze(
      <DropZone.Root
        aria-label="Attachments"
        disabled
        invalid
        onFiles={onFiles}
        ref={rootRef}
        required
      >
        <DropZone.Label>Drop attachments</DropZone.Label>
        <DropZone.Description>PDF or image, up to 5 MB.</DropZone.Description>
        <DropZone.Error>An attachment is required.</DropZone.Error>
      </DropZone.Root>,
    );

    expect(rootRef.current).toHaveAttribute('data-disabled');
    expect(rootRef.current).toHaveAttribute('aria-invalid', 'true');
    expect(rootRef.current).toHaveAttribute('data-required', 'true');
    expect(screen.getByRole('button', { name: /Attachments/ })).toBeDisabled();
    expect(screen.getByText('PDF or image, up to 5 MB.')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent(
      'An attachment is required.',
    );

    fireEvent.dragEnter(rootRef.current as HTMLDivElement, { dataTransfer });
    fireEvent.drop(rootRef.current as HTMLDivElement, { dataTransfer });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
