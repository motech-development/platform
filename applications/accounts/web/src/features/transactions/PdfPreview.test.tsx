import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PdfPreview } from './PdfPreview';

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({
  default: 'pdf-worker.js',
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
  Page: ({ pageNumber }: Readonly<{ pageNumber: number }>) => (
    <p>PDF page {pageNumber}</p>
  ),
  pdfjs: { GlobalWorkerOptions: {} },
}));

describe('PdfPreview', () => {
  it('renders every page after the PDF opens', async () => {
    const user = userEvent.setup();

    render(<PdfPreview file={new Blob(['pdf'])} />);

    expect(screen.getByText('Opening PDF…')).toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'Finish loading PDF' }),
    );

    expect(screen.getByText('PDF page 1')).toBeInTheDocument();
    expect(screen.getByText('PDF page 2')).toBeInTheDocument();
  });
});
