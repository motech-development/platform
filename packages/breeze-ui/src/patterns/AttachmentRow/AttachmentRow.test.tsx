import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  AttachmentRow,
  type AttachmentRowAction,
  type AttachmentRowProps,
} from './AttachmentRow';

expectTypeOf<AttachmentRowProps>().not.toHaveProperty('children');
expectTypeOf<AttachmentRowProps>().not.toHaveProperty('className');
expectTypeOf<AttachmentRowProps>().not.toHaveProperty('style');

describe('AttachmentRow', () => {
  it('shows a document thumbnail, file details, text status, and a direct open action', async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();

    renderBreeze(
      <AttachmentRow
        fileType="document"
        filename="fen-lane-garage-invoice.pdf"
        onOpen={onOpen}
        sizeBytes={84_000}
        status="Uploaded"
      />,
    );

    expect(screen.getByText('Document')).toBeInTheDocument();
    expect(screen.getByText('fen-lane-garage-invoice.pdf')).toBeInTheDocument();
    expect(screen.getByText('84 kB')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(onOpen).toHaveBeenCalledExactlyOnceWith();
  });

  it('renders a photo thumbnail and exposes menu actions through the callback', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn<(action: AttachmentRowAction) => void>();
    const downloadAction = {
      icon: 'download',
      id: 'download',
      label: 'Download',
    } satisfies AttachmentRowAction;

    const { container } = renderBreeze(
      <AttachmentRow
        actions={[downloadAction]}
        fileType="photo"
        filename="IMG_4471.jpg"
        onAction={onAction}
        sizeBytes={1_200_000}
        status="Uploaded"
        thumbnailUrl="/attachments/IMG_4471.jpg"
      />,
    );

    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('IMG_4471.jpg')).toBeInTheDocument();
    expect(screen.getByText('1.2 MB')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute(
      'src',
      '/attachments/IMG_4471.jpg',
    );

    await user.click(screen.getByRole('button', { name: 'More actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Download' }));

    expect(onAction).toHaveBeenCalledExactlyOnceWith(downloadAction);
  });

  it('replaces unavailable attachment details with a busy loading row', () => {
    renderBreeze(<AttachmentRow loading />);

    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('formats the size using the provider locale', () => {
    const { container } = renderBreeze(
      <AttachmentRow
        fileType="photo"
        filename="IMG_4471.jpg"
        sizeBytes={1_200_000}
        status="Uploaded"
      />,
      'de-DE',
    );

    expect(screen.getByText('Photo')).toBeInTheDocument();
    expect(screen.getByText('1,2 MB')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('marks unoverridden labels with their default message language', () => {
    render(
      <BreezeProvider locale="de-DE">
        <AttachmentRow
          actions={[{ id: 'download', label: 'Download' }]}
          fileType="document"
          filename="invoice.pdf"
          onAction={() => {}}
          onOpen={() => {}}
          sizeBytes={84_000}
          status="Uploaded"
        />
      </BreezeProvider>,
    );

    expect(screen.getByText('Document')).toHaveAttribute('lang', 'en-GB');
    expect(
      screen.getByRole('button', { name: 'Open' }).parentElement,
    ).toHaveAttribute('lang', 'en-GB');
    expect(
      screen.getByRole('button', { name: 'More actions' }).parentElement,
    ).toHaveAttribute('lang', 'en-GB');
  });

  it('uses provider overrides and marks them with the provider locale', () => {
    render(
      <BreezeProvider
        locale="de-DE"
        messages={{
          attachmentDocument: 'Dokument',
          attachmentMoreActions: 'Weitere Aktionen',
          attachmentOpen: 'Öffnen',
          attachmentPhoto: 'Foto',
        }}
      >
        <>
          <AttachmentRow
            actions={[{ id: 'download', label: 'Download' }]}
            fileType="document"
            filename="invoice.pdf"
            onAction={() => {}}
            onOpen={() => {}}
            sizeBytes={84_000}
            status="Uploaded"
          />
          <AttachmentRow
            fileType="photo"
            filename="receipt.jpg"
            sizeBytes={84_000}
            status="Uploaded"
          />
        </>
      </BreezeProvider>,
    );

    expect(screen.getByText('Dokument')).toHaveAttribute('lang', 'de-DE');
    expect(screen.getByText('Foto')).toHaveAttribute('lang', 'de-DE');
    expect(
      screen.getByRole('button', { name: 'Öffnen' }).parentElement,
    ).toHaveAttribute('lang', 'de-DE');
    expect(
      screen.getByRole('button', { name: 'Weitere Aktionen' }).parentElement,
    ).toHaveAttribute('lang', 'de-DE');
  });

  it('requires a non-empty visible status', () => {
    expect(() =>
      renderBreeze(
        <AttachmentRow
          fileType="document"
          filename="invoice.pdf"
          sizeBytes={84_000}
          status="  "
        />,
      ),
    ).toThrow('AttachmentRow status must be non-empty.');
  });

  it('requires the Breeze provider', () => {
    expect(() =>
      render(
        <AttachmentRow
          fileType="document"
          filename="invoice.pdf"
          sizeBytes={84_000}
          status="Uploaded"
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
