import type { PDFDocumentProxy, TextLayer } from 'pdfjs-dist';

const maxCanvasPixels = 16_777_216;

export interface PdfSession {
  dispose: () => void;
  document: PDFDocumentProxy;
  textLayer: typeof TextLayer;
}

export interface PdfAssetOptions {
  cMapUrl?: string;
  standardFontDataUrl?: string;
  workerSrc?: string;
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
  assets?: PdfAssetOptions,
): Promise<PdfSession> {
  throwIfAborted(signal);

  const pdfjs = await import('pdfjs-dist');
  throwIfAborted(signal);

  // Vite and webpack 5 both emit this pattern's worker; `?url` imports are Vite-only.
  const workerSrc =
    assets?.workerSrc?.trim() ||
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  const cMapUrl = normalizeDirectoryUrl(assets?.cMapUrl);
  const standardFontDataUrl = normalizeDirectoryUrl(
    assets?.standardFontDataUrl,
  );
  const loadingTask = pdfjs.getDocument({
    ...(cMapUrl ? { cMapPacked: true, cMapUrl } : {}),
    // Presigned URLs expire after 30s (#1524); a later range request 403s (#1596).
    disableRange: true,
    ...(standardFontDataUrl ? { standardFontDataUrl } : {}),
    stopAtErrors: true,
    url: source,
  });
  let destroyPromise: Promise<void> | null = null;
  const dispose = () => {
    if (destroyPromise) return;

    destroyPromise = (async () => {
      try {
        await loadingTask.destroy();
      } catch {
        // Disposal is best-effort because PDF.js may already have stopped the worker.
      }
    })();
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

/** Paints a PDF page off screen and commits once both layers finish, keeping the old paint until then. */
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
  const displayCanvas = canvas;
  const displayTextLayer = textLayerContainer;
  const { ownerDocument } = displayCanvas;
  const renderCanvas = ownerDocument.createElement('canvas');
  try {
    if (signal.aborted) return;

    const totalRotation = (((page.rotate + rotation) % 360) + 360) % 360;
    const viewport = page.getViewport({ rotation: totalRotation, scale });
    const context = renderCanvas.getContext('2d');
    const displayContext = displayCanvas.getContext('2d');

    if (!context || !displayContext) {
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
    const renderTextLayerContainer = ownerDocument.createElement('div');
    renderTextLayerContainer.style.width = `${viewport.width}px`;
    renderTextLayerContainer.style.height = `${viewport.height}px`;

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

    if (signal.aborted) return;

    // Resizing clears the canvas, so draw in the same task to avoid a blank frame.
    displayCanvas.width = renderCanvas.width;
    displayCanvas.height = renderCanvas.height;
    displayContext.drawImage(renderCanvas, 0, 0);
    displayCanvas.style.width = `${viewport.width}px`;
    displayCanvas.style.height = `${viewport.height}px`;
    displayTextLayer.style.cssText = renderTextLayerContainer.style.cssText;
    displayTextLayer.dataset.mainRotation = String(viewport.rotation);
    displayTextLayer.replaceChildren(...renderTextLayerContainer.childNodes);
    const pageContainer = displayTextLayer.parentElement;
    pageContainer?.style.setProperty('--scale-factor', String(viewport.scale));
    pageContainer?.style.setProperty('--user-unit', String(page.userUnit));
  } finally {
    // Release the off-screen bitmap; mobile browsers cap total canvas memory.
    renderCanvas.width = 0;
    renderCanvas.height = 0;
    page.cleanup();
  }
}
