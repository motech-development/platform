import { IconButton, Toolbar } from '@motech-development/breeze-ui';
import {
  RotateIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from '@motech-development/breeze-ui/icons';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

const maximumPageWidth = 720;
const minimumZoom = 10;
const zoomStep = 10;

export function PdfPreview({ file }: Readonly<{ file: Blob }>) {
  const { t } = useTranslation('attachments');
  const [pages, setPages] = useState(0);
  const [pageWidth, setPageWidth] = useState(maximumPageWidth);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(100);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) return undefined;

    const updatePageWidth = () => {
      if (viewport.clientWidth > 0) {
        setPageWidth(Math.min(viewport.clientWidth, maximumPageWidth));
      }
    };

    updatePageWidth();

    if (typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver(updatePageWidth);

    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[45rem] flex-col gap-4">
      <Toolbar aria-label={t('PDF controls')} className="justify-center">
        <IconButton
          aria-label={t('Zoom in')}
          onAction={() => setZoom((current) => current + zoomStep)}
        >
          <ZoomInIcon />
        </IconButton>
        <span aria-live="polite" className="min-w-16 text-center tabular-nums">
          {zoom}%
        </span>
        <IconButton
          aria-label={t('Zoom out')}
          disabled={zoom === minimumZoom}
          onAction={() =>
            setZoom((current) => Math.max(minimumZoom, current - zoomStep))
          }
        >
          <ZoomOutIcon />
        </IconButton>
        <IconButton
          aria-label={t('Rotate clockwise')}
          onAction={() => setRotation((current) => (current + 90) % 360)}
        >
          <RotateIcon />
        </IconButton>
      </Toolbar>
      <div className="overflow-auto" ref={viewportRef}>
        <Document
          className="flex flex-col items-center gap-5"
          file={file}
          loading={<p>{t('Opening PDF…')}</p>}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
        >
          {Array.from({ length: pages }, (_, index) => (
            <Page
              key={`page-${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              rotate={rotation}
              scale={zoom / 100}
              width={pageWidth}
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
