import type { PDFDocumentProxy, TextLayer } from 'pdfjs-dist';

export interface PdfSession {
  dispose: () => void;
  document: PDFDocumentProxy;
  textLayer: typeof TextLayer;
}

/** Loads PDF.js and its matching worker only after a PDF has been opened. */
export async function loadPdfDocument(source: string): Promise<PdfSession> {
  const pdfjs = await import('pdfjs-dist');
  const { default: workerSrc } = await import(
    'pdfjs-dist/build/pdf.worker.mjs?url'
  );
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const loadingTask = pdfjs.getDocument({ url: source });

  try {
    const document = await loadingTask.promise;

    return {
      dispose: () => {
        loadingTask.destroy().catch(() => undefined);
      },
      document,
      textLayer: pdfjs.TextLayer,
    };
  } catch (error) {
    await loadingTask.destroy().catch(() => undefined);
    throw error;
  }
}

/** Paints one PDF page into a canvas and its selectable text layer. */
export async function renderPdfPage(
  document: PDFDocumentProxy,
  TextLayer: PdfSession['textLayer'],
  pageNumber: number,
  canvas: HTMLCanvasElement,
  textLayerContainer: HTMLDivElement,
  scale: number,
  rotation: number,
  signal: AbortSignal,
): Promise<void> {
  const renderCanvas = canvas;
  const renderTextLayerContainer = textLayerContainer;
  const page = await document.getPage(pageNumber);
  if (signal.aborted) return;

  const viewport = page.getViewport({ rotation, scale });
  const context = renderCanvas.getContext('2d');

  if (!context) {
    throw new Error('The browser could not create a PDF canvas context.');
  }

  renderCanvas.width = viewport.width;
  renderCanvas.height = viewport.height;
  renderCanvas.style.width = `${viewport.width}px`;
  renderCanvas.style.height = `${viewport.height}px`;
  renderTextLayerContainer.replaceChildren();
  renderTextLayerContainer.style.width = `${viewport.width}px`;
  renderTextLayerContainer.style.height = `${viewport.height}px`;

  const renderTask = page.render({
    canvas: renderCanvas,
    canvasContext: context,
    viewport,
  });
  const cancelRender = () => renderTask.cancel();
  signal.addEventListener('abort', cancelRender, { once: true });

  try {
    await renderTask.promise;
  } finally {
    signal.removeEventListener('abort', cancelRender);
  }

  if (signal.aborted) return;

  const textLayer = new TextLayer({
    container: renderTextLayerContainer,
    textContentSource: page.streamTextContent(),
    viewport,
  });
  const cancelTextLayer = () => textLayer.cancel();
  signal.addEventListener('abort', cancelTextLayer, { once: true });

  try {
    await textLayer.render();
  } finally {
    signal.removeEventListener('abort', cancelTextLayer);
  }
}
