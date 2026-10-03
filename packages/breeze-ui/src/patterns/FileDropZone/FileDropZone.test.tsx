import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
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
      screen.getByRole('region', { name: 'Add attachments' }),
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

  it.each([false, true])(
    'names the drop area from a field label above it and describes its limits when compact is %s',
    (compact) => {
      renderBreeze(
        <FileDropZone
          accept=".pdf,image/*"
          compact={compact}
          label="Invoice or receipt"
          maxSize={5_000_000}
          onFilesAdded={vi.fn()}
        />,
      );

      const zone = screen.getByRole('region', { name: 'Invoice or receipt' });

      expect(zone).not.toContainElement(screen.getByText('Invoice or receipt'));
      expect(zone).toHaveAccessibleDescription(
        'Drop files here or choose files. Accepted file types: .pdf, image/*. ' +
          'Maximum file size: 5 megabytes.',
      );
      expect(
        within(zone).getByRole('button', { name: 'Choose files' }),
      ).toBeEnabled();
    },
  );

  it('describes the drop area with its instructions alone when it has no limits', () => {
    renderBreeze(
      <FileDropZone label="Add attachments" onFilesAdded={vi.fn()} />,
    );

    expect(
      screen.getByRole('region', { name: 'Add attachments' }),
    ).toHaveAccessibleDescription('Drop files here or choose files.');
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

    const zone = screen.getByRole('region', { name: 'Add attachments' });
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
        types: ['Files'],
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

  it('rounds a file-size limit into the next unit when needed', () => {
    renderBreeze(
      <FileDropZone
        label="Add attachments"
        maxSize={999_950}
        onFilesAdded={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Maximum file size: 1 megabyte.'),
    ).toBeInTheDocument();
  });

  it('keeps a fractional byte limit in the byte unit', () => {
    renderBreeze(
      <FileDropZone
        label="Add attachments"
        maxSize={999.95}
        onFilesAdded={vi.fn()}
      />,
    );

    expect(
      screen.getByText('Maximum file size: 1,000 bytes.'),
    ).toBeInTheDocument();
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

    fireEvent.drop(screen.getByRole('region'), {
      dataTransfer: {
        files: [new File(['text'], 'notes.txt', { type: 'text/plain' })],
        types: ['Files'],
      },
    });

    const status = screen.getByRole('status');

    expect(status).toHaveTextContent(
      'Aucun fichier ajouté. notes.txt : Type non accepté. Formats autorisés : .pdf.',
    );
    expect(status.querySelectorAll('[lang="fr-FR"]')).toHaveLength(2);
  });

  it('formats numeric placeholders in each message language', () => {
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();
    const file = new File(['pdf'], 'report.pdf', { type: 'application/pdf' });
    const repeatedFiles = Array.from({ length: 1112 }, () => file);
    const frenchAddedCount = new Intl.NumberFormat('fr-FR').format(1111);
    const frenchCount = new Intl.NumberFormat('fr-FR').format(1234);
    const frenchMaximum = new Intl.NumberFormat('fr-FR').format(2345);
    const englishCount = new Intl.NumberFormat('en-GB').format(1234);
    const englishMaximum = new Intl.NumberFormat('en-GB').format(2345);

    render(
      <BreezeProvider
        locale="fr-FR"
        messages={{
          fileDropZoneAddedMany: 'Ajout de {count} fichiers.',
          fileDropZoneAttachedCount: 'Fichiers joints : {current} sur {max}.',
        }}
      >
        <FileDropZone
          currentFileCount={1234}
          label="French limits"
          maxFiles={2345}
          onFilesAdded={onFilesAdded}
        />
      </BreezeProvider>,
    );

    const zone = screen.getByRole('region', { name: 'French limits' });
    const frenchInstructions = zone.querySelector('span[lang="fr-FR"]');

    expect(frenchInstructions).toHaveAttribute('lang', 'fr-FR');
    expect(frenchInstructions?.textContent).toBe(
      `Fichiers joints : ${frenchCount} sur ${frenchMaximum}.`,
    );

    fireEvent.drop(zone, {
      dataTransfer: { files: repeatedFiles, types: ['Files'] },
    });

    const status = screen.getByRole('status');

    expect(status.textContent).toBe(
      `Ajout de ${frenchAddedCount} fichiers. File count limit: report.pdf. Maximum of ${englishMaximum} files total; ${englishCount} currently attached.`,
    );
    expect(status.querySelector('[lang="fr-FR"]')).toBeInTheDocument();
    expect(status.querySelector('[lang="en-GB"]')).toBeInTheDocument();
    expect(onFilesAdded).toHaveBeenCalledExactlyOnceWith(
      repeatedFiles.slice(0, 1111),
    );
  });

  it('ignores text and link drags while accepting file drags', () => {
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();

    renderBreeze(
      <FileDropZone label="Add attachments" onFilesAdded={onFilesAdded} />,
    );

    const zone = screen.getByRole('region', { name: 'Add attachments' });
    const textAndLinkData = {
      files: [],
      types: ['text/plain', 'text/uri-list'],
    };

    fireEvent.dragEnter(zone, { dataTransfer: textAndLinkData });

    expect(screen.queryByText('Release to add files.')).not.toBeInTheDocument();
    expect(fireEvent.dragOver(zone, { dataTransfer: textAndLinkData })).toBe(
      true,
    );
    expect(fireEvent.drop(zone, { dataTransfer: textAndLinkData })).toBe(true);
    expect(onFilesAdded).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();

    const file = new File(['pdf'], 'report.pdf', { type: 'application/pdf' });
    const fileData = { files: [file], types: ['Files'] };

    fireEvent.dragEnter(zone, { dataTransfer: fileData });

    expect(screen.getByText('Release to add files.')).toBeInTheDocument();
    expect(fireEvent.dragOver(zone, { dataTransfer: fileData })).toBe(false);
    expect(fireEvent.drop(zone, { dataTransfer: fileData })).toBe(false);
    expect(onFilesAdded).toHaveBeenCalledExactlyOnceWith([file]);
  });

  it.each([
    [undefined, true, true],
    ['.pdf,.jpg,.png', true, true],
    ['.pdf,image/*', true, true],
    ['image/jpeg', true, true],
    ['.pdf,.png', true, false],
    ['.pdf,.jpg', false, false],
  ])(
    'offers Take photo for accept %s with camera %s: %s',
    (accept, camera, offered) => {
      const { container } = renderBreeze(
        <FileDropZone
          accept={accept}
          camera={camera}
          label="Invoice or receipt"
          onFilesAdded={vi.fn()}
        />,
      );

      expect(
        screen.queryByRole('button', { name: 'Take photo' }) !== null,
      ).toBe(offered);
      expect(
        container.querySelector('input[capture="environment"]') !== null,
      ).toBe(offered);
    },
  );

  it('opens the camera from Take photo with a pointer or keyboard and validates captured photos', async () => {
    const user = userEvent.setup();
    const onFilesAdded = vi.fn<(files: readonly File[]) => void>();
    const { container } = renderBreeze(
      <FileDropZone
        accept=".pdf,.jpg,.png"
        camera
        compact
        label="Invoice or receipt"
        maxSize={100}
        onFilesAdded={onFilesAdded}
      />,
    );
    const zone = screen.getByRole('region', { name: 'Invoice or receipt' });
    const cameraInput = container.querySelector<HTMLInputElement>(
      'input[capture="environment"]',
    );

    expect(
      within(zone)
        .getAllByRole('button')
        .map((button) => button.getAttribute('aria-label')),
    ).toEqual(['Take photo', 'Choose files']);
    expect(cameraInput).toHaveAttribute('accept', 'image/*');
    expect(cameraInput).not.toHaveAttribute('multiple');

    const openCamera = vi.spyOn(cameraInput!, 'click');
    const takePhoto = screen.getByRole('button', { name: 'Take photo' });

    await user.click(takePhoto);
    takePhoto.focus();
    await user.keyboard('{Enter}');

    expect(openCamera).toHaveBeenCalledTimes(2);

    const photo = new File(['jpeg'], 'image.jpg', { type: 'image/jpeg' });
    const heic = new File(['heic'], 'image.heic', { type: 'image/heic' });
    const large = new File(['x'.repeat(101)], 'large.jpg', {
      type: 'image/jpeg',
    });

    await user.upload(cameraInput!, photo);

    expect(onFilesAdded).toHaveBeenCalledExactlyOnceWith([photo]);
    expect(screen.getByRole('status')).toHaveTextContent('Added 1 file.');

    await user.upload(cameraInput!, heic);

    expect(screen.getByRole('status')).toHaveTextContent(
      'No files were added. image.heic: File type is not accepted.',
    );

    await user.upload(cameraInput!, large);

    expect(onFilesAdded).toHaveBeenCalledOnce();
    expect(screen.getByRole('status')).toHaveTextContent(
      'No files were added. large.jpg: File exceeds the 100 bytes size limit.',
    );
  });

  it('labels Take photo from provider messages in their language', () => {
    render(
      <BreezeProvider
        locale="fr-FR"
        messages={{ fileDropZoneTakePhoto: 'Prendre une photo' }}
      >
        <FileDropZone camera label="Facture ou reçu" onFilesAdded={vi.fn()} />
      </BreezeProvider>,
    );

    expect(
      screen
        .getByRole('button', { name: 'Prendre une photo' })
        .closest('[lang]'),
    ).toHaveAttribute('lang', 'fr-FR');
    expect(
      screen.getByRole('button', { name: 'Choose files' }).closest('[lang]'),
    ).toHaveAttribute('lang', 'en-GB');
  });

  it('requires the Breeze provider', () => {
    expect(() =>
      render(<FileDropZone label="Add attachments" onFilesAdded={vi.fn()} />),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
