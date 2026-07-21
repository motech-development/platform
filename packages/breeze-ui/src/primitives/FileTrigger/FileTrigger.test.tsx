import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { FileTrigger } from './FileTrigger';

describe('FileTrigger', () => {
  it('opens a native file dialog by keyboard and returns native files', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const inputRef = createRef<HTMLInputElement>();

    renderBreeze(
      <FileTrigger.Root onFiles={onFiles} ref={inputRef}>
        <FileTrigger.Trigger>Choose files</FileTrigger.Trigger>
      </FileTrigger.Root>,
    );

    const input = inputRef.current;

    expect(input).toBeInstanceOf(HTMLInputElement);
    if (!input) {
      throw new Error('Expected the native file input ref.');
    }
    const openDialog = vi.spyOn(input, 'click');
    const file = new File(['clinical note'], 'note.txt', {
      type: 'text/plain',
    });

    screen.getByRole('button', { name: 'Choose files' }).focus();
    await user.keyboard('{Enter}');
    expect(openDialog).toHaveBeenCalledOnce();

    fireEvent.change(input, { target: { files: [file] } });
    expect(onFiles).toHaveBeenCalledWith([file]);
  });

  it('accepts matching files and presents type and size rejections', () => {
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const inputRef = createRef<HTMLInputElement>();
    const accepted = new File(['img'], 'accepted.png', {
      type: 'image/png',
    });
    const wrongType = new File(['text'], 'notes.txt', {
      type: 'text/plain',
    });
    const tooLarge = new File(['12345'], 'large.png', {
      type: 'image/png',
    });

    renderBreeze(
      <FileTrigger.Root
        acceptedFileTypes={['image/*', '.jpg']}
        allowsMultiple
        maxFileSize={4}
        onFiles={onFiles}
        onReject={onReject}
        ref={inputRef}
      >
        <FileTrigger.Trigger>Choose images</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>,
      {
        messages: {
          fileSizeRejection: 'Le fichier dépasse la taille maximale.',
          fileTypeRejection: "Le type de fichier n'est pas accepté.",
        },
      },
    );

    fireEvent.change(inputRef.current as HTMLInputElement, {
      target: { files: [accepted, wrongType, tooLarge] },
    });

    expect(onFiles).toHaveBeenCalledWith([accepted]);
    expect(onReject).toHaveBeenCalledWith([
      { file: wrongType, reasons: ['file-type'] },
      { file: tooLarge, reasons: ['file-size'] },
    ]);
    expect(screen.getByRole('alert')).toHaveTextContent(
      "notes.txt: Le type de fichier n'est pas accepté.",
    );
    expect(screen.getByRole('alert')).toHaveTextContent(
      'large.png: Le fichier dépasse la taille maximale.',
    );
  });

  it('rejects extra files and exposes disabled, invalid, and required state', async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const onReject = vi.fn();
    const inputRef = createRef<HTMLInputElement>();
    const first = new File(['first'], 'first.txt', { type: 'text/plain' });
    const extra = new File(['extra'], 'extra.txt', { type: 'text/plain' });

    const { unmount } = renderBreeze(
      <FileTrigger.Root
        disabled
        invalid
        onFiles={onFiles}
        onReject={onReject}
        ref={inputRef}
        required
      >
        <FileTrigger.Trigger>Choose one file</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>,
    );

    const button = screen.getByRole('button', { name: 'Choose one file' });

    expect(button).toBeDisabled();
    expect(inputRef.current).toHaveAttribute('aria-invalid', 'true');
    expect(inputRef.current).toHaveAttribute('aria-required', 'true');
    await user.click(button);
    expect(onFiles).not.toHaveBeenCalled();

    unmount();
    renderBreeze(
      <FileTrigger.Root onFiles={onFiles} onReject={onReject} ref={inputRef}>
        <FileTrigger.Trigger>Choose one file</FileTrigger.Trigger>
        <FileTrigger.Feedback />
      </FileTrigger.Root>,
    );
    fireEvent.change(inputRef.current as HTMLInputElement, {
      target: { files: [first, extra] },
    });

    expect(onFiles).toHaveBeenLastCalledWith([first]);
    expect(onReject).toHaveBeenLastCalledWith([
      { file: extra, reasons: ['file-count'] },
    ]);
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Only one file may be selected.',
    );
  });
});
