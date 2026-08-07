import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export function PdfPreview({ file }: Readonly<{ file: Blob }>) {
  const { t } = useTranslation('attachments');
  const [pages, setPages] = useState(0);

  return (
    <div className="[&_canvas]:h-auto! mx-auto w-[min(100%,45rem)] [&_canvas]:max-w-full">
      <Document
        file={file}
        loading={<p>{t('Opening PDF…')}</p>}
        onLoadSuccess={({ numPages }) => setPages(numPages)}
      >
        {Array.from({ length: pages }, (_, index) => (
          <Page
            key={`page-${index + 1}`}
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            width={720}
          />
        ))}
      </Document>
    </div>
  );
}
