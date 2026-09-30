import type { PDFDocumentProxy, TextLayer } from 'pdfjs-dist';

export interface PdfSession {
  dispose: () => void;
  document: PDFDocumentProxy;
  textLayer: typeof TextLayer;
}

function getAbortError(signal: AbortSignal) {
  return signal.reason instanceof Error
    ? signal.reason
    : new DOMException('The PDF load was aborted.', 'AbortError');
}

function throwIfAborted(signal: AbortSignal) {
  if (!signal.aborted) return;
  throw getAbortError(signal);
}

/** Loads PDF.js and its matching worker only after a PDF has been opened. */
export async function loadPdfDocument(
  source: string,
  signal: AbortSignal,
): Promise<PdfSession> {
  throwIfAborted(signal);

  const pdfjs = await import('pdfjs-dist');
  throwIfAborted(signal);

  const { default: workerSrc } = await import(
    'pdfjs-dist/build/pdf.worker.mjs?url'
  );
  throwIfAborted(signal);

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const loadingTask = pdfjs.getDocument({ url: source });
  let destroyPromise: Promise<void> | null = null;
  const dispose = () => {
    if (destroyPromise) return;

    try {
      destroyPromise = loadingTask.destroy().catch(() => undefined);
    } catch {
      destroyPromise = Promise.resolve();
    }
  };
  let removeAbortListener: () => void = () => undefined;
  const aborted = new Promise<never>((_, reject) => {
    const abort = () => {
      dispose();
      reject(getAbortError(signal));
    };

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
    removeAbortListener = () => signal.removeEventListener('abort', abort);
  });

  try {
    const document = await Promise.race([loadingTask.promise, aborted]);
    throwIfAborted(signal);

    return {
      dispose,
      document,
      textLayer: pdfjs.TextLayer,
    };
  } catch (error) {
    dispose();
    throw error;
  } finally {
    removeAbortListener();
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

  const totalRotation = (((page.rotate + rotation) % 360) + 360) % 360;
  const viewport = page.getViewport({ rotation: totalRotation, scale });
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
  renderTextLayerContainer.setAttribute(
    'data-main-rotation',
    String(viewport.rotation),
  );
  const pageContainer = renderTextLayerContainer.parentElement;
  pageContainer?.style.setProperty('--scale-factor', String(viewport.scale));
  pageContainer?.style.setProperty('--user-unit', String(page.userUnit));

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
