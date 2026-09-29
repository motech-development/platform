import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { FileDropZone, type FileDropZoneProps } from './FileDropZone';

expectTypeOf<FileDropZoneProps>().not.toHaveProperty('children');
expectTypeOf<FileDropZoneProps>().not.toHaveProperty('className');
expectTypeOf<FileDropZoneProps>().not.toHaveProperty('style');
expectTypeOf<FileDropZoneProps>().not.toHaveProperty('slot');
expectTypeOf<FileDropZoneProps['onFilesAdded']>().toEqualTypeOf<
  (files: readonly File[]) => void
>();

describe('FileDropZone', () => {
  it('provides an accessible picker control and reports selected files', async () => {
    const user = userEvent.setup();
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();
    const { container } = renderBreeze(
      <FileDropZone
        accept=".pdf,image/*"
        label="Add attachments"
        onFilesAdded={onFilesAdded}
      />,
    );
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');

    expect(
      screen.getByRole('group', { name: 'Add attachments' }),
    ).toHaveAttribute('aria-describedby');
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeEnabled();
    expect(input).not.toBeNull();
    expect(input).toHaveAttribute('accept', '.pdf,image/*');

    const clickPicker = vi.spyOn(input!, 'click');
    await user.click(screen.getByRole('button', { name: 'Choose files' }));

    expect(clickPicker).toHaveBeenCalledExactlyOnceWith();

    const pdf = new File(['contents'], 'report.PDF', {
      type: 'application/pdf',
    });
    await user.upload(input!, pdf);

    expect(onFilesAdded).toHaveBeenCalledExactlyOnceWith([pdf]);
    expect(screen.getByRole('status')).toHaveTextContent('Added 1 file.');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  it('uses the same validation for dropped files and announces type, size, and count rejections', () => {
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();

    renderBreeze(
      <FileDropZone
        accept=".pdf,image/*"
        currentFileCount={1}
        label="Add attachments"
        maxFiles={2}
        maxSize={100}
        onFilesAdded={onFilesAdded}
      />,
    );

    const zone = screen.getByRole('group', { name: 'Add attachments' });
    const acceptedFile = new File(['pdf'], 'report.pdf', {
      type: 'application/pdf',
    });
    const typeRejectedFile = new File(['text'], 'notes.txt', {
      type: 'text/plain',
    });
    const sizeRejectedFile = new File(['x'.repeat(101)], 'large.pdf', {
      type: 'application/pdf',
    });
    const countRejectedFile = new File(['image'], 'photo.png', {
      type: 'image/png',
    });

    fireEvent.drop(zone, {
      dataTransfer: {
        files: [
          typeRejectedFile,
          sizeRejectedFile,
          acceptedFile,
          countRejectedFile,
        ],
      },
    });

    expect(onFilesAdded).toHaveBeenCalledExactlyOnceWith([acceptedFile]);
    expect(screen.getByRole('status')).toHaveTextContent(
      'Added 1 file. notes.txt: File type is not accepted. Accepted types: ' +
        '.pdf, image/*. large.pdf: File exceeds the 100 bytes size limit. ' +
        'File count limit: photo.png. Maximum of 2 files total; 1 currently attached.',
    );
    expect(screen.getByRole('status')).toBeVisible();
  });

  it('supports exact MIME types and accepts the same picker file more than once', async () => {
    const user = userEvent.setup();
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();
    const { container } = renderBreeze(
      <FileDropZone
        accept="application/pdf"
        label="Add reports"
        onFilesAdded={onFilesAdded}
      />,
    );
    const input =
      container.querySelector<HTMLInputElement>('input[type="file"]');
    const pdf = new File(['contents'], 'report.pdf', {
      type: 'application/pdf',
    });

    await user.upload(input!, pdf);

    const status = screen.getByRole('status');
    const liveRegionMutations: MutationRecord[] = [];
    const observer = new MutationObserver((mutations) =>
      liveRegionMutations.push(...mutations),
    );
    observer.observe(status, {
      characterData: true,
      childList: true,
      subtree: true,
    });

    await user.upload(input!, pdf);
    await waitFor(() => expect(liveRegionMutations.length).toBeGreaterThan(0));
    observer.disconnect();

    expect(onFilesAdded).toHaveBeenCalledTimes(2);
    expect(onFilesAdded).toHaveBeenNthCalledWith(1, [pdf]);
    expect(onFilesAdded).toHaveBeenNthCalledWith(2, [pdf]);
    expect(status).toHaveTextContent('Added 1 file.');
  });

  it('uses provider message overrides and marks their language', () => {
    render(
      <BreezeProvider
        locale="fr-FR"
        messages={{
          fileDropZoneChooseFiles: 'Choisir des fichiers',
          fileDropZoneDropInstructions:
            'Déposez les fichiers ou choisissez-les.',
          fileDropZoneNoFilesAdded: 'Aucun fichier ajouté.',
          fileDropZoneTypeRejected:
            '{fileName} : Type non accepté. Formats autorisés : {types}.',
        }}
      >
        <FileDropZone
          accept=".pdf"
          label="Ajouter des pièces jointes"
          onFilesAdded={vi.fn()}
        />
      </BreezeProvider>,
    );

    const button = screen.getByRole('button', {
      name: 'Choisir des fichiers',
    });
    const instructions = screen.getByText(
      'Déposez les fichiers ou choisissez-les.',
    );
    const englishFallback = screen.getByText('Accepted file types: .pdf.');

    expect(button.closest('[lang]')).toHaveAttribute('lang', 'fr-FR');
    expect(instructions).toHaveAttribute('lang', 'fr-FR');
    expect(englishFallback).toHaveAttribute('lang', 'en-GB');

    fireEvent.drop(screen.getByRole('group'), {
      dataTransfer: {
        files: [new File(['text'], 'notes.txt', { type: 'text/plain' })],
      },
    });

    const status = screen.getByRole('status');

    expect(status).toHaveTextContent(
      'Aucun fichier ajouté. notes.txt : Type non accepté. Formats autorisés : .pdf.',
    );
    expect(status.querySelectorAll('[lang="fr-FR"]')).toHaveLength(2);
  });

  it('requires the Breeze provider', () => {
    expect(() =>
      render(<FileDropZone label="Add attachments" onFilesAdded={vi.fn()} />),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
