import { TextLayer } from 'pdfjs-dist';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadPdfDocument, renderPdfPage } from './pdf-renderer';

const pdfjsMocks = vi.hoisted(() => ({
  getDocument: vi.fn(),
  textLayerConstruct: vi.fn(),
  textLayerRender: vi.fn<() => Promise<void>>(),
}));

vi.mock('pdfjs-dist', async (importOriginal) => {
  const pdfjs = await importOriginal<typeof import('pdfjs-dist')>();

  return {
    ...pdfjs,
    TextLayer: class MockTextLayer {
      renderPromise: Promise<void> | undefined;

      constructor(options: unknown) {
        pdfjsMocks.textLayerConstruct(options);
      }

      cancel() {
        this.renderPromise = undefined;
      }

      render() {
        this.renderPromise = pdfjsMocks.textLayerRender();
        return this.renderPromise;
      }
    },
    getDocument: pdfjsMocks.getDocument,
  };
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((onResolve) => {
    resolve = onResolve;
  });

  return { promise, resolve };
}

function createLoadingTask(document: object) {
  return {
    destroy: vi.fn().mockResolvedValue(undefined),
    promise: Promise.resolve(document),
  };
}

describe('PDF renderer adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    pdfjsMocks.getDocument.mockReset();
    pdfjsMocks.textLayerConstruct.mockReset();
    pdfjsMocks.textLayerRender.mockReset();
    pdfjsMocks.textLayerRender.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('destroys a pending PDF loading task promptly when its signal aborts', async () => {
    const pendingDocument = deferred<object>();
    const task = {
      destroy: vi.fn().mockResolvedValue(undefined),
      promise: pendingDocument.promise,
    };
    pdfjsMocks.getDocument.mockReturnValue(task);
    const controller = new AbortController();

    const loading = loadPdfDocument(
      '/attachments/report.pdf',
      controller.signal,
    );
    await vi.waitFor(() =>
      expect(pdfjsMocks.getDocument).toHaveBeenCalledOnce(),
    );

    controller.abort();

    await expect(loading).rejects.toHaveProperty('name', 'AbortError');
    expect(task.destroy).toHaveBeenCalledOnce();

    pendingDocument.resolve({});
  });

  it('does not create a loading task when its signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    await expect(
      loadPdfDocument('/attachments/report.pdf', controller.signal),
    ).rejects.toHaveProperty('name', 'AbortError');
    expect(pdfjsMocks.getDocument).not.toHaveBeenCalled();
  });

  it('passes configured CMaps and standard fonts to PDF.js as directory URLs', async () => {
    const task = createLoadingTask({ numPages: 1 });
    pdfjsMocks.getDocument.mockReturnValue(task);

    await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
      {
        cMapUrl: ' /assets/pdfjs/cmaps ',
        standardFontDataUrl: ' / ',
      },
    );

    expect(pdfjsMocks.getDocument).toHaveBeenCalledWith({
      cMapPacked: true,
      cMapUrl: '/assets/pdfjs/cmaps/',
      standardFontDataUrl: '/',
      stopAtErrors: true,
      url: '/attachments/report.pdf',
    });
  });

  it('destroys a loaded task only once when the session is disposed repeatedly', async () => {
    const task = createLoadingTask({ numPages: 1 });
    pdfjsMocks.getDocument.mockReturnValue(task);

    const session = await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
    );

    session.dispose();
    session.dispose();

    expect(task.destroy).toHaveBeenCalledOnce();
  });

  it.each([0, 90, 180, 270])(
    'keeps the text layer aligned with an intrinsic %s degree page rotation',
    async (intrinsicRotation) => {
      const viewport = {
        height: 600,
        rotation: intrinsicRotation,
        scale: 1,
        width: 400,
      };
      const page = {
        cleanup: vi.fn(),
        getViewport: vi.fn().mockReturnValue(viewport),
        render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
        rotate: intrinsicRotation,
        streamTextContent: vi.fn(),
        userUnit: 1,
      };
      const canvas = document.createElement('canvas');
      const canvasContext = {} as CanvasRenderingContext2D;
      vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
      const pageContainer = document.createElement('div');
      const textLayer = document.createElement('div');
      pageContainer.append(textLayer);

      await renderPdfPage(
        {
          getPage: vi.fn().mockResolvedValue(page),
        } as never,
        TextLayer,
        1,
        canvas,
        textLayer,
        1,
        0,
        new AbortController().signal,
      );

      expect(page.getViewport).toHaveBeenCalledWith({
        rotation: intrinsicRotation,
        scale: 1,
      });
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(600);
      expect(canvas.style.width).toBe('400px');
      expect(canvas.style.height).toBe('600px');
      expect(textLayer.style.width).toBe('400px');
      expect(textLayer.style.height).toBe('600px');
      expect(pageContainer.style.getPropertyValue('--scale-factor')).toBe('1');
      expect(pageContainer.style.getPropertyValue('--user-unit')).toBe('1');
      expect(pdfjsMocks.textLayerConstruct).toHaveBeenCalledWith(
        expect.objectContaining({ viewport }),
      );
      expect(page.cleanup).toHaveBeenCalledOnce();
    },
  );

  it('composes user rotation with the intrinsic rotation and scales a nondefault user unit', async () => {
    const viewport = {
      height: 800,
      rotation: 90,
      scale: 1,
      width: 600,
    };
    const page = {
      cleanup: vi.fn(),
      getViewport: vi.fn().mockReturnValue(viewport),
      render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      rotate: 270,
      streamTextContent: vi.fn(),
      userUnit: 2,
    };
    const canvas = document.createElement('canvas');
    const canvasContext = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);

    await renderPdfPage(
      {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      TextLayer,
      1,
      canvas,
      textLayer,
      1,
      180,
      new AbortController().signal,
      2,
    );

    expect(page.getViewport).toHaveBeenCalledWith({ rotation: 90, scale: 1 });
    expect(pageContainer.style.getPropertyValue('--scale-factor')).toBe('1');
    expect(pageContainer.style.getPropertyValue('--user-unit')).toBe('2');
    expect(canvas.width).toBe(1200);
    expect(canvas.height).toBe(1600);
    expect(canvas.style.width).toBe('600px');
    expect(canvas.style.height).toBe('800px');
    expect(page.render).toHaveBeenCalledWith(
      expect.objectContaining({ transform: [2, 0, 0, 2, 0, 0] }),
    );
    expect(page.cleanup).toHaveBeenCalledOnce();
  });

  it('caps high-density canvas allocation while preserving logical page dimensions', async () => {
    const viewport = {
      height: 3000,
      rotation: 0,
      scale: 1,
      width: 4000,
    };
    const page = {
      cleanup: vi.fn(),
      getViewport: vi.fn().mockReturnValue(viewport),
      render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      rotate: 0,
      streamTextContent: vi.fn(),
      userUnit: 1,
    };
    const canvas = document.createElement('canvas');
    const canvasContext = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);
    const outputScale = 2;
    const maximumCanvasPixels = 16_777_216;
    const effectiveScale = Math.sqrt(
      maximumCanvasPixels / (viewport.width * viewport.height),
    );

    await renderPdfPage(
      {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      TextLayer,
      1,
      canvas,
      textLayer,
      1,
      0,
      new AbortController().signal,
      outputScale,
    );

    expect(canvas.width * canvas.height).toBeLessThanOrEqual(
      maximumCanvasPixels,
    );
    expect(canvas.width).toBe(Math.floor(viewport.width * effectiveScale));
    expect(canvas.height).toBe(Math.floor(viewport.height * effectiveScale));
    expect(canvas.style.width).toBe('4000px');
    expect(canvas.style.height).toBe('3000px');
    expect(textLayer.style.width).toBe('4000px');
    expect(textLayer.style.height).toBe('3000px');
    expect(pdfjsMocks.textLayerConstruct).toHaveBeenCalledWith(
      expect.objectContaining({ viewport }),
    );
    expect(page.render).toHaveBeenCalledWith(
      expect.objectContaining({
        transform: [effectiveScale, 0, 0, effectiveScale, 0, 0],
        viewport,
      }),
    );
    expect(page.cleanup).toHaveBeenCalledOnce();
  });

  it('keeps extreme aspect-ratio canvases within the pixel limit', async () => {
    const viewport = {
      height: 200_000_000,
      rotation: 0,
      scale: 1,
      width: 0.1,
    };
    const page = {
      cleanup: vi.fn(),
      getViewport: vi.fn().mockReturnValue(viewport),
      render: vi.fn().mockReturnValue({ promise: Promise.resolve() }),
      rotate: 0,
      streamTextContent: vi.fn(),
      userUnit: 1,
    };
    const canvas = document.createElement('canvas');
    const canvasContext = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);

    await renderPdfPage(
      {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      TextLayer,
      1,
      canvas,
      textLayer,
      1,
      0,
      new AbortController().signal,
      2,
    );

    expect(canvas.width * canvas.height).toBeLessThanOrEqual(16_777_216);
    expect(canvas.style.width).toBe('0.1px');
    expect(canvas.style.height).toBe('200000000px');
    expect(textLayer.style.width).toBe('0.1px');
    expect(textLayer.style.height).toBe('200000000px');
    expect(page.cleanup).toHaveBeenCalledOnce();
  });

  it('cancels a page paint and cleans up the page after the render settles', async () => {
    const render = deferred<void>();
    const cancel = vi.fn();
    const page = {
      cleanup: vi.fn(),
      getViewport: vi
        .fn()
        .mockReturnValue({ height: 600, scale: 1, width: 400 }),
      render: vi.fn().mockReturnValue({ cancel, promise: render.promise }),
      rotate: 0,
      streamTextContent: vi.fn(),
      userUnit: 1,
    };
    const canvas = document.createElement('canvas');
    const canvasContext = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, 'getContext').mockReturnValue(canvasContext);
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);
    const controller = new AbortController();

    const renderPage = renderPdfPage(
      { getPage: vi.fn().mockResolvedValue(page) } as never,
      TextLayer,
      1,
      canvas,
      textLayer,
      1,
      0,
      controller.signal,
    );
    await vi.waitFor(() => expect(page.render).toHaveBeenCalledOnce());

    controller.abort();
    expect(cancel).toHaveBeenCalledOnce();
    render.resolve();
    await renderPage;

    expect(page.cleanup).toHaveBeenCalledOnce();
    expect(pdfjsMocks.textLayerConstruct).not.toHaveBeenCalled();
  });
});
