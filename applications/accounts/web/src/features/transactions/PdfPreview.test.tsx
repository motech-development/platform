import { BreezeProvider } from '@motech-development/breeze-ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PdfPreview } from './PdfPreview';

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'pdf-worker.js',
}));

vi.mock('@motech-development/breeze-ui/icons', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('@motech-development/breeze-ui/icons')
  >()),
  RotateIcon: () => <svg aria-hidden="true" />,
  ZoomInIcon: () => <svg aria-hidden="true" />,
  ZoomOutIcon: () => <svg aria-hidden="true" />,
}));

vi.mock('react-pdf', () => ({
  Document: ({
    children,
    loading,
    onLoadSuccess,
  }: Readonly<{
    children: ReactNode;
    loading: ReactNode;
    onLoadSuccess: (document: { numPages: number }) => void;
  }>) => (
    <div>
      {loading}
      <button onClick={() => onLoadSuccess({ numPages: 2 })} type="button">
        Finish loading PDF
      </button>
      {children}
    </div>
  ),
  Page: ({
    pageNumber,
    rotate,
    scale,
  }: Readonly<{ pageNumber: number; rotate: number; scale: number }>) => (
    <p data-rotate={rotate} data-scale={scale}>
      PDF page {pageNumber}
    </p>
  ),
  pdfjs: { GlobalWorkerOptions: {} },
}));

describe('PdfPreview', () => {
  it('renders every page after the PDF opens', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <PdfPreview file={new Blob(['pdf'])} />
      </BreezeProvider>,
    );

    expect(screen.getByText('Opening PDF…')).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: 'PDF controls' })).toBeVisible();
    expect(screen.getByText('100%')).toBeVisible();

    await user.click(
      screen.getByRole('button', { name: 'Finish loading PDF' }),
    );

    const firstPage = screen.getByText('PDF page 1');

    expect(firstPage).toHaveAttribute('data-rotate', '0');
    expect(firstPage).toHaveAttribute('data-scale', '1');
    expect(screen.getByText('PDF page 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('110%')).toBeVisible();
    expect(firstPage).toHaveAttribute('data-scale', '1.1');

    await user.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(screen.getByText('100%')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Rotate clockwise' }));
    expect(firstPage).toHaveAttribute('data-rotate', '90');
  });
});
