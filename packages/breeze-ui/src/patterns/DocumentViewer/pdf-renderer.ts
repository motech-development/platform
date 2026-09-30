import type { PDFDocumentProxy, TextLayer } from 'pdfjs-dist';

const maxCanvasPixels = 16_777_216;

export interface PdfSession {
  dispose: () => void;
  document: PDFDocumentProxy;
  textLayer: typeof TextLayer;
}

export interface PdfAssetDirectories {
  cMapUrl?: string;
  standardFontDataUrl?: string;
}

function normalizeDirectoryUrl(url?: string) {
  const directoryUrl = url?.trim();
  if (!directoryUrl) return undefined;

  return directoryUrl.endsWith('/') ? directoryUrl : `${directoryUrl}/`;
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
  assets?: PdfAssetDirectories,
): Promise<PdfSession> {
  throwIfAborted(signal);

  const pdfjs = await import('pdfjs-dist');
  throwIfAborted(signal);

  const { default: workerSrc } = await import(
    'pdfjs-dist/build/pdf.worker.mjs?url'
  );
  throwIfAborted(signal);

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const cMapUrl = normalizeDirectoryUrl(assets?.cMapUrl);
  const standardFontDataUrl = normalizeDirectoryUrl(
    assets?.standardFontDataUrl,
  );
  const loadingTask = pdfjs.getDocument({
    ...(cMapUrl ? { cMapPacked: true, cMapUrl } : {}),
    ...(standardFontDataUrl ? { standardFontDataUrl } : {}),
    stopAtErrors: true,
    url: source,
  });
  let destroyPromise: Promise<void> | null = null;
  const dispose = () => {
    if (destroyPromise) return;

    let destruction: Promise<void>;
    try {
      destruction = loadingTask.destroy();
    } catch {
      destroyPromise = Promise.resolve();
      return;
    }

    destroyPromise = destruction.catch(() => undefined);
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

interface PdfPageRenderOptions {
  readonly TextLayer: PdfSession['textLayer'];
  readonly canvas: HTMLCanvasElement;
  readonly document: PDFDocumentProxy;
  readonly outputScale?: number;
  readonly pageNumber: number;
  readonly rotation: number;
  readonly scale: number;
  readonly signal: AbortSignal;
  readonly textLayerContainer: HTMLDivElement;
}

/** Paints one PDF page into a canvas and its selectable text layer. */
export async function renderPdfPage({
  TextLayer,
  canvas,
  document,
  outputScale = 1,
  pageNumber,
  rotation,
  scale,
  signal,
  textLayerContainer,
}: PdfPageRenderOptions): Promise<void> {
  const page = await document.getPage(pageNumber);
  try {
    if (signal.aborted) return;

    const totalRotation = (((page.rotate + rotation) % 360) + 360) % 360;
    const viewport = page.getViewport({ rotation: totalRotation, scale });
    const renderCanvas = canvas;
    const renderTextLayerContainer = textLayerContainer;
    const context = renderCanvas.getContext('2d');

    if (!context) {
      throw new Error('The browser could not create a PDF canvas context.');
    }

    const requestedPixelScale =
      Number.isFinite(outputScale) && outputScale > 0 ? outputScale : 1;
    const pagePixelCount = viewport.width * viewport.height;
    const maxPixelScale = Math.min(
      Math.sqrt(maxCanvasPixels / pagePixelCount),
      maxCanvasPixels / Math.max(viewport.width, viewport.height),
    );
    const pixelScale = Math.min(requestedPixelScale, maxPixelScale);
    renderCanvas.width = Math.max(1, Math.floor(viewport.width * pixelScale));
    renderCanvas.height = Math.max(1, Math.floor(viewport.height * pixelScale));
    renderCanvas.style.width = `${viewport.width}px`;
    renderCanvas.style.height = `${viewport.height}px`;
    renderTextLayerContainer.replaceChildren();
    renderTextLayerContainer.style.width = `${viewport.width}px`;
    renderTextLayerContainer.style.height = `${viewport.height}px`;
    renderTextLayerContainer.dataset.mainRotation = String(viewport.rotation);
    const pageContainer = renderTextLayerContainer.parentElement;
    pageContainer?.style.setProperty('--scale-factor', String(viewport.scale));
    pageContainer?.style.setProperty('--user-unit', String(page.userUnit));

    const renderTask = page.render({
      canvas: renderCanvas,
      canvasContext: context,
      ...(pixelScale === 1
        ? {}
        : { transform: [pixelScale, 0, 0, pixelScale, 0, 0] }),
      viewport,
    });
    const cancelRender = () => renderTask.cancel();
    signal.addEventListener('abort', cancelRender, { once: true });
    if (signal.aborted) cancelRender();

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
    if (signal.aborted) cancelTextLayer();

    try {
      await textLayer.render();
    } finally {
      signal.removeEventListener('abort', cancelTextLayer);
    }
  } finally {
    page.cleanup();
  }
}
