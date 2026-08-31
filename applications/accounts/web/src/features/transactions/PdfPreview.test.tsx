import { BreezeProvider } from '@motech-development/breeze-ui';
import { fireEvent, render, screen } from '@testing-library/react';
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
    options,
  }: Readonly<{
    children: ReactNode;
    loading: ReactNode;
    onLoadSuccess: (document: { numPages: number }) => void;
    options: {
      cMapPacked: boolean;
      cMapUrl: string;
      standardFontDataUrl: string;
      wasmUrl: string;
    };
  }>) => (
    <div
      data-cmap-packed={options.cMapPacked}
      data-cmap-url={options.cMapUrl}
      data-standard-font-data-url={options.standardFontDataUrl}
      data-testid="pdf-document"
      data-wasm-url={options.wasmUrl}
    >
      {loading}
      <button onClick={() => onLoadSuccess({ numPages: 2 })} type="button">
        Finish loading PDF
      </button>
      {children}
    </div>
  ),
  Page: ({
    pageNumber,
    renderAnnotationLayer,
    rotate,
    scale,
  }: Readonly<{
    pageNumber: number;
    renderAnnotationLayer?: boolean;
    rotate: number;
    scale: number;
  }>) => (
    <p
      data-annotation-layer={renderAnnotationLayer !== false}
      data-rotate={rotate}
      data-scale={scale}
    >
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
    expect(screen.getByTestId('pdf-document')).toHaveAttribute(
      'data-cmap-url',
      '/cmaps/',
    );
    expect(screen.getByTestId('pdf-document')).toHaveAttribute(
      'data-standard-font-data-url',
      '/standard_fonts/',
    );
    expect(screen.getByTestId('pdf-document')).toHaveAttribute(
      'data-wasm-url',
      '/wasm/',
    );

    await user.click(
      screen.getByRole('button', { name: 'Finish loading PDF' }),
    );

    const firstPage = screen.getByText('PDF page 1');

    expect(firstPage).toHaveAttribute('data-rotate', '0');
    expect(firstPage).toHaveAttribute('data-scale', '1');
    expect(firstPage).toHaveAttribute('data-annotation-layer', 'true');
    expect(screen.getByText('PDF page 2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));
    expect(screen.getByText('110%')).toBeVisible();
    expect(firstPage).toHaveAttribute('data-scale', '1.1');

    const zoomIn = screen.getByRole('button', { name: 'Zoom in' });

    for (let zoom = 120; zoom <= 210; zoom += 10) {
      fireEvent.click(zoomIn);
    }

    expect(screen.getByText('210%')).toBeVisible();
    expect(firstPage).toHaveAttribute('data-scale', '2.1');
    expect(zoomIn).toBeEnabled();

    const zoomOut = screen.getByRole('button', { name: 'Zoom out' });

    await user.click(zoomOut);
    expect(screen.getByText('200%')).toBeVisible();

    for (let zoom = 190; zoom >= 10; zoom -= 10) {
      fireEvent.click(zoomOut);
    }

    expect(screen.getByText('10%')).toBeVisible();
    expect(firstPage).toHaveAttribute('data-scale', '0.1');
    expect(zoomOut).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Rotate clockwise' }));
    expect(firstPage).toHaveAttribute('data-rotate', '90');
  });
});
