import * as pdfjs from 'pdfjs-dist';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadPdfDocument, renderPdfPage } from './pdf-renderer';

const { TextLayer } = pdfjs;

const pdfjsMocks = vi.hoisted(() => ({
  getDocument: vi.fn(),
  textLayerConstruct: vi.fn(),
  textLayerRender: vi.fn<() => Promise<void>>(),
}));

vi.mock('pdfjs-dist', async (importOriginal) => {
  const originalPdfjs = await importOriginal<typeof import('pdfjs-dist')>();

  return {
    ...originalPdfjs,
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

/** jsdom has no canvas backend; the renderer paints off screen, then copies. */
function mockCanvasContext() {
  const context = { drawImage: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );

  return context;
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

  it('uses a supplied worker URL instead of the bundled worker asset', async () => {
    const task = createLoadingTask({ numPages: 1 });
    pdfjsMocks.getDocument.mockReturnValue(task);

    await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
      { workerSrc: ' /app/assets/pdf.worker.mjs ' },
    );

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toBe(
      '/app/assets/pdf.worker.mjs',
    );
    expect(pdfjsMocks.getDocument).toHaveBeenCalledOnce();
  });

  it('resolves the installed worker relative to the module when the configured worker URL is blank', async () => {
    const task = createLoadingTask({ numPages: 1 });
    pdfjsMocks.getDocument.mockReturnValue(task);

    await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
      { workerSrc: '   ' },
    );

    expect(pdfjs.GlobalWorkerOptions.workerSrc).toMatch(
      /\/pdfjs-dist\/build\/pdf\.worker\.mjs$/,
    );
    expect(pdfjsMocks.getDocument).toHaveBeenCalledOnce();
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

  it('passes configured CMaps and standard fonts to PDF.js as directory URLs and disables ranges', async () => {
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
      disableRange: true,
      standardFontDataUrl: '/',
      stopAtErrors: true,
      url: '/attachments/report.pdf',
    });
  });

  it('loads the whole file in one request because presigned range requests expire', async () => {
    const task = createLoadingTask({ numPages: 1 });
    pdfjsMocks.getDocument.mockReturnValue(task);

    await loadPdfDocument(
      'https://files.example.test/report.pdf?X-Amz-Expires=30',
      new AbortController().signal,
    );

    expect(pdfjsMocks.getDocument).toHaveBeenCalledWith(
      expect.objectContaining({
        disableRange: true,
        url: 'https://files.example.test/report.pdf?X-Amz-Expires=30',
      }),
    );
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

  it('keeps disposal safe when destroying the loading task throws synchronously', async () => {
    const task = createLoadingTask({ numPages: 1 });
    task.destroy.mockImplementation(() => {
      throw new Error('The loading task could not be destroyed.');
    });
    pdfjsMocks.getDocument.mockReturnValue(task);

    const session = await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
    );

    expect(() => session.dispose()).not.toThrow();
    expect(() => session.dispose()).not.toThrow();
    expect(task.destroy).toHaveBeenCalledOnce();
  });

  it('keeps disposal safe when destroying the loading task rejects', async () => {
    const task = createLoadingTask({ numPages: 1 });
    task.destroy.mockRejectedValue(new Error('The worker did not stop.'));
    pdfjsMocks.getDocument.mockReturnValue(task);

    const session = await loadPdfDocument(
      '/attachments/report.pdf',
      new AbortController().signal,
    );

    expect(() => session.dispose()).not.toThrow();
    await vi.waitFor(() => expect(task.destroy).toHaveBeenCalledOnce());
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
      mockCanvasContext();
      const pageContainer = document.createElement('div');
      const textLayer = document.createElement('div');
      pageContainer.append(textLayer);

      await renderPdfPage({
        TextLayer,
        canvas,
        document: {
          getPage: vi.fn().mockResolvedValue(page),
        } as never,
        pageNumber: 1,
        rotation: 0,
        scale: 1,
        signal: new AbortController().signal,
        textLayerContainer: textLayer,
      });

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
    mockCanvasContext();
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);

    await renderPdfPage({
      TextLayer,
      canvas,
      document: {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      outputScale: 2,
      pageNumber: 1,
      rotation: 180,
      scale: 1,
      signal: new AbortController().signal,
      textLayerContainer: textLayer,
    });

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
    mockCanvasContext();
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);
    const outputScale = 2;
    const maximumCanvasPixels = 16_777_216;
    const effectiveScale = Math.sqrt(
      maximumCanvasPixels / (viewport.width * viewport.height),
    );

    await renderPdfPage({
      TextLayer,
      canvas,
      document: {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      outputScale,
      pageNumber: 1,
      rotation: 0,
      scale: 1,
      signal: new AbortController().signal,
      textLayerContainer: textLayer,
    });

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
    mockCanvasContext();
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);

    await renderPdfPage({
      TextLayer,
      canvas,
      document: {
        getPage: vi.fn().mockResolvedValue(page),
      } as never,
      outputScale: 2,
      pageNumber: 1,
      rotation: 0,
      scale: 1,
      signal: new AbortController().signal,
      textLayerContainer: textLayer,
    });

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
    mockCanvasContext();
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    pageContainer.append(textLayer);
    const controller = new AbortController();

    const renderPage = renderPdfPage({
      TextLayer,
      canvas,
      document: { getPage: vi.fn().mockResolvedValue(page) } as never,
      pageNumber: 1,
      rotation: 0,
      scale: 1,
      signal: controller.signal,
      textLayerContainer: textLayer,
    });
    await vi.waitFor(() => expect(page.render).toHaveBeenCalledOnce());

    controller.abort();
    expect(cancel).toHaveBeenCalledOnce();
    render.resolve();
    await renderPage;

    expect(page.cleanup).toHaveBeenCalledOnce();
    expect(pdfjsMocks.textLayerConstruct).not.toHaveBeenCalled();
  });
  it('keeps the previous paint visible until a re-render has fully finished', async () => {
    const render = deferred<void>();
    const page = {
      cleanup: vi.fn(),
      getViewport: vi
        .fn()
        .mockReturnValue({ height: 600, rotation: 0, scale: 1, width: 400 }),
      render: vi
        .fn<(options: { canvas: HTMLCanvasElement }) => object>()
        .mockReturnValue({ promise: render.promise }),
      rotate: 0,
      streamTextContent: vi.fn(),
      userUnit: 1,
    };
    const context = mockCanvasContext();
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const pageContainer = document.createElement('div');
    const textLayer = document.createElement('div');
    const previousText = document.createElement('span');
    previousText.textContent = 'Previous text';
    textLayer.append(previousText);
    pageContainer.append(textLayer);

    const renderPage = renderPdfPage({
      TextLayer,
      canvas,
      document: { getPage: vi.fn().mockResolvedValue(page) } as never,
      outputScale: 2,
      pageNumber: 1,
      rotation: 0,
      scale: 1,
      signal: new AbortController().signal,
      textLayerContainer: textLayer,
    });
    await vi.waitFor(() => expect(page.render).toHaveBeenCalledOnce());

    const renderTarget = page.render.mock.calls[0]?.[0].canvas;
    expect(renderTarget).not.toBe(canvas);
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(600);
    expect(textLayer).toContainElement(previousText);
    expect(context.drawImage).not.toHaveBeenCalled();

    render.resolve();
    await renderPage;

    expect(context.drawImage).toHaveBeenCalledWith(renderTarget, 0, 0);
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(1200);
    expect(canvas.style.width).toBe('400px');
    expect(textLayer).not.toContainElement(previousText);
    expect(renderTarget.width).toBe(0);
  });

  it('leaves the previous paint untouched when a re-render is cancelled', async () => {
    const render = deferred<void>();
    const page = {
      cleanup: vi.fn(),
      getViewport: vi
        .fn()
        .mockReturnValue({ height: 600, rotation: 0, scale: 1, width: 400 }),
      render: vi
        .fn()
        .mockReturnValue({ cancel: vi.fn(), promise: render.promise }),
      rotate: 0,
      streamTextContent: vi.fn(),
      userUnit: 1,
    };
    const context = mockCanvasContext();
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const textLayer = document.createElement('div');
    const previousText = document.createElement('span');
    textLayer.append(previousText);
    document.createElement('div').append(textLayer);
    const controller = new AbortController();

    const renderPage = renderPdfPage({
      TextLayer,
      canvas,
      document: { getPage: vi.fn().mockResolvedValue(page) } as never,
      outputScale: 2,
      pageNumber: 1,
      rotation: 0,
      scale: 1,
      signal: controller.signal,
      textLayerContainer: textLayer,
    });
    await vi.waitFor(() => expect(page.render).toHaveBeenCalledOnce());
    controller.abort();
    render.resolve();
    await renderPage;

    expect(context.drawImage).not.toHaveBeenCalled();
    expect(canvas.width).toBe(400);
    expect(canvas.height).toBe(600);
    expect(textLayer).toContainElement(previousText);
    expect(page.cleanup).toHaveBeenCalledOnce();
  });
});
