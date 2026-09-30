import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from 'vitest';
import renderBreeze from '../../../test/render';
import { ParentOverlayContext } from '../../overlays/OverlayStack';
import { Drawer } from '../../primitives/Drawer/Drawer';
import { BreezeProvider } from '../../provider/BreezeProvider';
import { AttachmentRow } from '../AttachmentRow/AttachmentRow';
import { DocumentViewer, type DocumentViewerProps } from './DocumentViewer';
import type { PdfSession } from './pdf-renderer';
import { loadPdfDocument, renderPdfPage } from './pdf-renderer';

vi.mock('./pdf-renderer', () => ({
  loadPdfDocument: vi.fn(),
  renderPdfPage: vi.fn(),
}));

const mockLoadPdfDocument = vi.mocked(loadPdfDocument);
const mockRenderPdfPage = vi.mocked(renderPdfPage);
const originalStartTransition = Object.getOwnPropertyDescriptor(
  document,
  'startViewTransition',
);
const originalViewTransition = Object.getOwnPropertyDescriptor(
  window,
  'ViewTransition',
);
const originalCss = Object.getOwnPropertyDescriptor(window, 'CSS');
const originalMatchMedia = Object.getOwnPropertyDescriptor(
  window,
  'matchMedia',
);
const originalFullscreenEnabled = Object.getOwnPropertyDescriptor(
  document,
  'fullscreenEnabled',
);
const originalFullscreenElement = Object.getOwnPropertyDescriptor(
  document,
  'fullscreenElement',
);
const originalExitFullscreen = Object.getOwnPropertyDescriptor(
  document,
  'exitFullscreen',
);
const originalRequestFullscreen = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'requestFullscreen',
);
const originalResizeObserver = Object.getOwnPropertyDescriptor(
  window,
  'ResizeObserver',
);
const originalDevicePixelRatio = Object.getOwnPropertyDescriptor(
  window,
  'devicePixelRatio',
);
const originalCreateObjectURL = Object.getOwnPropertyDescriptor(
  URL,
  'createObjectURL',
);
const originalGetAnimations = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'getAnimations',
);

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((onResolve) => {
    resolve = onResolve;
  });
  return { promise, resolve };
}

function pdfSession(numPages = 2): PdfSession {
  return {
    dispose: vi.fn(),
    document: { numPages } as PdfSession['document'],
    textLayer: vi.fn() as unknown as PdfSession['textLayer'],
  };
}

function restoreDescriptor(
  target: object,
  property: PropertyKey,
  descriptor: PropertyDescriptor | undefined,
) {
  if (descriptor) Object.defineProperty(target, property, descriptor);
  else Reflect.deleteProperty(target, property);
}

expectTypeOf<DocumentViewerProps>().not.toHaveProperty('children');
expectTypeOf<DocumentViewerProps>().not.toHaveProperty('className');
expectTypeOf<DocumentViewerProps>().not.toHaveProperty('style');
expectTypeOf<{
  defaultOpen: boolean;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  mediaType: 'image';
  src: string;
  title: string;
}>().not.toExtend<DocumentViewerProps>();
expectTypeOf<{
  defaultOpen: boolean;
  mediaType: 'image';
  pdfAssets: { cMapUrl: string };
  src: string;
  title: string;
}>().not.toExtend<DocumentViewerProps>();

describe('DocumentViewer', () => {
  afterEach(() => {
    restoreDescriptor(document, 'startViewTransition', originalStartTransition);
    restoreDescriptor(window, 'ViewTransition', originalViewTransition);
    restoreDescriptor(window, 'CSS', originalCss);
    restoreDescriptor(window, 'matchMedia', originalMatchMedia);
    restoreDescriptor(document, 'fullscreenEnabled', originalFullscreenEnabled);
    restoreDescriptor(document, 'fullscreenElement', originalFullscreenElement);
    restoreDescriptor(document, 'exitFullscreen', originalExitFullscreen);
    restoreDescriptor(
      HTMLElement.prototype,
      'requestFullscreen',
      originalRequestFullscreen,
    );
    restoreDescriptor(window, 'ResizeObserver', originalResizeObserver);
    restoreDescriptor(window, 'devicePixelRatio', originalDevicePixelRatio);
    restoreDescriptor(URL, 'createObjectURL', originalCreateObjectURL);
    restoreDescriptor(
      HTMLElement.prototype,
      'getAnimations',
      originalGetAnimations,
    );
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadPdfDocument.mockReset();
    mockRenderPdfPage.mockReset();
    mockRenderPdfPage.mockImplementation(
      (
        _document,
        _textLayerClass,
        _pageNumber,
        canvas,
        textLayer,
        scale,
        _rotation,
        signal,
        outputScale = 1,
      ) => {
        if (signal.aborted) return Promise.resolve();

        const width = 400 * scale;
        const height = 600 * scale;
        Object.assign(canvas, {
          height: Math.ceil(height * outputScale),
          width: Math.ceil(width * outputScale),
        });
        Object.assign(canvas.style, {
          height: `${height}px`,
          width: `${width}px`,
        });
        Object.assign(textLayer.style, {
          height: `${height}px`,
          width: `${width}px`,
        });
        return Promise.resolve();
      },
    );
  });

  it('keeps a closed viewer out of the page until its controlled state opens', () => {
    const onOpenChange = vi.fn();

    renderBreeze(
      <DocumentViewer
        mediaType="image"
        onOpenChange={onOpenChange}
        open={false}
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );

    expect(screen.queryByRole('dialog', { name: 'Receipt' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Open Receipt' })).toBeNull();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('renders an opened image with working zoom, rotation, download and app actions', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const onReplace = vi.fn();
    const onRemove = vi.fn();

    renderBreeze(
      <DocumentViewer
        mediaType="image"
        onOpenChange={onOpenChange}
        onRemove={onRemove}
        onReplace={onReplace}
        open
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Receipt' });
    const image = document.body.querySelector('img');
    if (!image) throw new Error('The image preview was not rendered.');
    expect(image).toHaveAttribute('src', '/attachments/receipt.jpg');
    fireEvent.load(image);
    await waitFor(() => expect(image).toBeVisible());

    await user.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
    expect(image.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1.25)',
    });

    await user.click(
      within(dialog).getByRole('button', { name: 'Rotate clockwise' }),
    );
    expect(image.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(90deg) scale(1.25)',
    });

    expect(
      within(dialog).getByRole('link', { name: 'Download' }),
    ).toHaveAttribute('download', 'Receipt');
    await user.click(within(dialog).getByRole('button', { name: 'Replace' }));
    await user.click(within(dialog).getByRole('button', { name: 'Remove' }));

    expect(onReplace).toHaveBeenCalledOnce();
    expect(onRemove).toHaveBeenCalledOnce();
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it('downloads cross-origin files as blobs so the filename is honored', async () => {
    const user = userEvent.setup();
    const remoteSource = 'https://files.example.test/attachments/report.pdf';
    mockLoadPdfDocument.mockResolvedValue(pdfSession(1));
    const fetchMock = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(new Blob(['report'])),
      ok: true,
    });
    vi.stubGlobal('fetch', fetchMock);
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:http://localhost/report'),
    });
    const downloadedAnchors: HTMLAnchorElement[] = [];
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(
      function mockAnchorClick(this: HTMLAnchorElement) {
        if (this.hidden) downloadedAnchors.push(this);
      },
    );

    renderBreeze(
      <DocumentViewer
        defaultOpen
        downloadName="Quarterly report.pdf"
        mediaType="pdf"
        src={remoteSource}
        title="Quarterly report"
      />,
    );

    await user.click(await screen.findByRole('link', { name: 'Download' }));

    await waitFor(() => expect(downloadedAnchors).toHaveLength(1));
    expect(fetchMock).toHaveBeenCalledWith(remoteSource, {
      credentials: 'same-origin',
    });
    expect(downloadedAnchors[0]).toHaveAttribute(
      'href',
      'blob:http://localhost/report',
    );
    expect(downloadedAnchors[0]).toHaveAttribute(
      'download',
      'Quarterly report.pdf',
    );
  });

  it('keeps painted content visible while an ordinary close animation exits', async () => {
    const user = userEvent.setup();
    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="image"
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );

    const stage = await screen.findByRole('region', { name: 'Receipt' });
    const image = document.body.querySelector('img');
    if (!image) throw new Error('The image preview was not rendered.');
    fireEvent.load(image);
    await waitFor(() => expect(stage).toHaveAttribute('aria-busy', 'false'));

    await user.click(await screen.findByRole('button', { name: 'Close' }));

    expect(stage).toHaveAttribute('aria-busy', 'false');
    expect(
      stage.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
  });

  it('remounts the same image source when the viewer quickly closes and reopens', async () => {
    const user = userEvent.setup();

    function ReopenImageViewer() {
      const [open, setOpen] = useState(true);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open attachment preview
          </button>
          <DocumentViewer
            mediaType="image"
            onOpenChange={setOpen}
            open={open}
            src="/attachments/receipt.jpg"
            title="Receipt"
          />
        </>
      );
    }

    renderBreeze(<ReopenImageViewer />);
    const firstImage = await waitFor(() => {
      const image = document.body.querySelector('img');
      if (!image) throw new Error('The image preview was not rendered.');
      return image;
    });
    fireEvent.load(firstImage);
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );

    await user.click(await screen.findByRole('button', { name: 'Close' }));
    const reopenButton = document.body.querySelector(
      '[data-breeze-root] button',
    );
    if (!reopenButton) throw new Error('Expected the attachment open button.');
    fireEvent.click(reopenButton);

    const reopenedImage = await waitFor(() => {
      const image = document.body.querySelector('img');
      if (!image) throw new Error('The reopened image preview is absent.');
      return image;
    });
    expect(reopenedImage).not.toBe(firstImage);
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).toBeInTheDocument();
    fireEvent.load(reopenedImage);
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );
  });

  it('refits a loaded image after the padded stage resizes and disconnects on unmount', async () => {
    const user = userEvent.setup();
    const observers: {
      callback: ResizeObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
    }[] = [];
    class TestResizeObserver {
      callback: ResizeObserverCallback;

      disconnect = vi.fn();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }

      observe = vi.fn();

      unobserve = vi.fn();
    }
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: TestResizeObserver,
    });

    const { unmount } = renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="image"
        src="/attachments/landscape.jpg"
        title="Landscape"
      />,
    );
    const stage = await screen.findByRole('region', { name: 'Landscape' });
    const image = document.body.querySelector('img');
    if (!image) throw new Error('The image preview was not rendered.');
    const bounds = (width: number, height: number): DOMRect => ({
      bottom: height,
      height,
      left: 0,
      right: width,
      toJSON: () => ({}),
      top: 0,
      width,
      x: 0,
      y: 0,
    });
    stage.style.paddingTop = '16px';
    stage.style.paddingBottom = '16px';
    stage.style.paddingLeft = '16px';
    stage.style.paddingRight = '16px';
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(bounds(600, 500));
    Object.defineProperty(image, 'naturalWidth', {
      configurable: true,
      value: 1200,
    });
    Object.defineProperty(image, 'naturalHeight', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(image, 'complete', {
      configurable: true,
      value: true,
    });
    fireEvent.load(image);

    await waitFor(() => expect(image.style.width).toBe('568px'));
    expect(Number.parseFloat(image.style.height)).toBeCloseTo(378.67, 1);

    const dialog = await screen.findByRole('dialog', { name: 'Landscape' });
    await user.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
    await user.click(
      within(dialog).getByRole('button', { name: 'Rotate clockwise' }),
    );
    expect(image.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(90deg) scale(1.25)',
    });

    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(bounds(320, 600));
    const observer = observers.at(-1);
    if (!observer) throw new Error('The stage was not observed.');
    act(() => observer.callback([], observer as unknown as ResizeObserver));

    await waitFor(() => expect(image.style.width).toBe('432px'));
    expect(image.style.height).toBe('288px');
    expect(image.parentElement?.parentElement).toHaveStyle({
      height: '540px',
      width: '360px',
    });
    expect(image.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(90deg) scale(1.25)',
    });

    unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
  });

  it('resizes a native document frame to the padded stage dimensions', async () => {
    const observers: {
      callback: ResizeObserverCallback;
      disconnect: ReturnType<typeof vi.fn>;
    }[] = [];
    class TestResizeObserver {
      callback: ResizeObserverCallback;

      disconnect = vi.fn();

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }

      observe = vi.fn();

      unobserve = vi.fn();
    }
    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      value: TestResizeObserver,
    });

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="document"
        src="/attachments/scan.tif"
        title="Scan"
      />,
    );
    const stage = await screen.findByRole('region', {
      name: 'Scan',
    });
    const frame = document.body.querySelector('iframe');
    if (!frame) throw new Error('The browser-owned document frame is absent.');
    const bounds = (width: number, height: number): DOMRect => ({
      bottom: height,
      height,
      left: 0,
      right: width,
      toJSON: () => ({}),
      top: 0,
      width,
      x: 0,
      y: 0,
    });
    stage.style.paddingTop = '16px';
    stage.style.paddingBottom = '16px';
    stage.style.paddingLeft = '16px';
    stage.style.paddingRight = '16px';
    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(bounds(640, 360));
    fireEvent.load(frame);

    const mediaContent = frame.parentElement;
    if (!mediaContent) throw new Error('The frame media container is absent.');
    await waitFor(() => expect(mediaContent.style.width).toBe('608px'));
    expect(mediaContent.style.height).toBe('328px');

    vi.spyOn(stage, 'getBoundingClientRect').mockReturnValue(bounds(320, 240));
    const observer = observers[0];
    if (!observer) throw new Error('The stage was not observed.');
    act(() => observer.callback([], observer as unknown as ResizeObserver));

    await waitFor(() => expect(mediaContent.style.width).toBe('288px'));
    expect(mediaContent.style.height).toBe('208px');
  });

  it('sets the close message language when the provider overrides it', async () => {
    render(
      <BreezeProvider locale="fr-FR" messages={{ close: 'Fermer' }}>
        <DocumentViewer
          defaultOpen
          mediaType="image"
          src="/attachments/receipt.jpg"
          title="Receipt"
        />
      </BreezeProvider>,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Receipt' });
    const closeButton = within(dialog).getByRole('button', {
      name: 'Fermer',
    });
    expect(closeButton.closest('[lang]')).toHaveAttribute('lang', 'fr-FR');
  });

  it('uses the message language independently for the rotate label and accessible name', async () => {
    renderBreeze(
      <BreezeProvider
        locale="fr-FR"
        messages={{ documentViewerRotateLabel: 'Tourner le document' }}
      >
        <DocumentViewer
          defaultOpen
          mediaType="image"
          src="/attachments/receipt.jpg"
          title="Receipt"
        />
      </BreezeProvider>,
    );

    const rotateButton = await screen.findByRole('button', {
      name: 'Rotate clockwise',
    });
    const labelId = rotateButton.getAttribute('aria-labelledby');
    expect(labelId).not.toBeNull();
    expect(document.getElementById(labelId ?? '')).toHaveAttribute(
      'lang',
      'en-GB',
    );
    expect(rotateButton.parentElement).toHaveAttribute('lang', 'fr-FR');
  });

  it('marks default accessibility and fallback notices as English under a French provider', async () => {
    mockLoadPdfDocument.mockRejectedValueOnce(
      new Error('The optional peer is unavailable.'),
    );
    renderBreeze(
      <BreezeProvider locale="fr-FR">
        <DocumentViewer
          defaultOpen
          mediaType="pdf"
          src="/attachments/report.pdf"
          title="Report"
        />
      </BreezeProvider>,
    );

    const fallbackText =
      'The PDF preview is unavailable. The browser is opening the original file.';
    await screen.findByText(fallbackText);
    expect(screen.getByText(fallbackText)).toHaveAttribute('lang', 'en-GB');
    expect(
      screen.getByText(
        'The rendered document may expose no content to assistive technology. Its meaning comes from the surrounding record. Download the original file for another way to access it.',
      ),
    ).toHaveAttribute('lang', 'en-GB');
    expect(
      document.body.querySelector('[aria-label="Loading document"]')
        ?.parentElement,
    ).toHaveAttribute('lang', 'en-GB');
  });

  it('marks an image error notice as English under a French provider', async () => {
    renderBreeze(
      <BreezeProvider locale="fr-FR">
        <DocumentViewer
          defaultOpen
          mediaType="image"
          src="/attachments/missing.jpg"
          title="Receipt"
        />
      </BreezeProvider>,
    );
    const image = await waitFor(() => {
      const currentImage = document.body.querySelector('img');
      if (!currentImage) throw new Error('The image preview was not rendered.');
      return currentImage;
    });

    fireEvent.error(image);

    expect(
      screen.getByText('The image preview could not be loaded.'),
    ).toHaveAttribute('lang', 'en-GB');
  });

  it('hides app-owned actions when their callbacks are absent', async () => {
    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="image"
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Receipt' });
    expect(
      within(dialog).queryByRole('button', { name: 'Replace' }),
    ).toBeNull();
    expect(within(dialog).queryByRole('button', { name: 'Remove' })).toBeNull();
    expect(
      within(dialog).queryByRole('button', { name: 'Full screen' }),
    ).toBeNull();
  });

  it('does not load PDF.js until a PDF viewer is opened', () => {
    const { unmount } = renderBreeze(
      <DocumentViewer
        mediaType="pdf"
        onOpenChange={vi.fn()}
        open={false}
        src="/attachments/report.pdf"
        title="Report"
      />,
    );
    expect(mockLoadPdfDocument).not.toHaveBeenCalled();
    unmount();

    renderBreeze(
      <DocumentViewer
        mediaType="image"
        onOpenChange={vi.fn()}
        open
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );
    expect(mockLoadPdfDocument).not.toHaveBeenCalled();
  });

  it('does not load a PDF while its parent overlay is closed', () => {
    renderBreeze(
      <ParentOverlayContext
        value={{ id: 'parent', open: false, restoreFocus: vi.fn() }}
      >
        <DocumentViewer
          defaultOpen
          mediaType="pdf"
          src="/attachments/report.pdf"
          title="Report"
        />
      </ParentOverlayContext>,
    );

    expect(mockLoadPdfDocument).not.toHaveBeenCalled();
  });

  it('keeps an opened PDF behind its skeleton until a canvas render completes', async () => {
    const loading = deferred<PdfSession>();
    const rendering = deferred<void>();
    mockLoadPdfDocument.mockReturnValue(loading.promise);
    mockRenderPdfPage.mockReturnValue(rendering.promise);

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="pdf"
        src="/attachments/report.pdf"
        title="Report"
      />,
    );

    await waitFor(() => expect(mockLoadPdfDocument).toHaveBeenCalledOnce());
    expect(document.body.querySelector('iframe')).toBeNull();
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).toBeInTheDocument();

    loading.resolve(pdfSession());
    const canvas = await screen
      .findByRole('region', { name: 'Report' })
      .then((region) => region.querySelector('canvas'));
    expect(canvas).not.toBeNull();
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).toBeInTheDocument();
    await waitFor(() =>
      expect(mockRenderPdfPage).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        1,
        canvas,
        expect.any(HTMLDivElement),
        1,
        0,
        expect.any(AbortSignal),
        expect.any(Number),
      ),
    );

    rendering.resolve();
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );
  });

  it('supports paging across readable PDF canvases', async () => {
    const user = userEvent.setup();
    mockLoadPdfDocument.mockResolvedValue(pdfSession(2));

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="pdf"
        src="/attachments/report.pdf"
        title="Report"
      />,
    );

    const nextPage = await screen.findByRole('button', { name: 'Next page' });
    await user.click(nextPage);
    await waitFor(() =>
      expect(mockRenderPdfPage).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.anything(),
        2,
        expect.any(HTMLCanvasElement),
        expect.any(HTMLDivElement),
        1,
        0,
        expect.any(AbortSignal),
        expect.any(Number),
      ),
    );
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
  });

  it('renders PDF zoom at device density while retaining logical page dimensions', async () => {
    const user = userEvent.setup();
    mockLoadPdfDocument.mockResolvedValue(pdfSession(1));
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 2,
    });

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="pdf"
        src="/attachments/report.pdf"
        title="Report"
      />,
    );

    const stage = await screen.findByRole('region', { name: 'Report' });
    const canvas = await waitFor(() => {
      const renderedCanvas = stage.querySelector('canvas');
      if (!renderedCanvas) throw new Error('The PDF canvas was not rendered.');
      return renderedCanvas;
    });
    await waitFor(() => expect(stage).toHaveAttribute('aria-busy', 'false'));
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(1200);
    expect(canvas.style.width).toBe('400px');
    expect(canvas.style.height).toBe('600px');

    await user.click(screen.getByRole('button', { name: 'Zoom in' }));

    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledTimes(2));
    expect(mockRenderPdfPage.mock.calls[1]?.[8]).toBe(2.5);
    expect(canvas.width).toBe(1000);
    expect(canvas.height).toBe(1500);
    expect(canvas.style.width).toBe('400px');
    expect(canvas.style.height).toBe('600px');
    expect(stage).toHaveAttribute('aria-busy', 'false');
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
    expect(
      document.body.querySelector('.breeze-document-viewer-media-content'),
    ).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1.25)',
      width: '400px',
    });
  });

  it('waits for a cancelled PDF paint before rendering the updated zoom', async () => {
    const user = userEvent.setup();
    const firstRender = deferred<void>();
    let firstSignal: AbortSignal | undefined;
    mockLoadPdfDocument.mockResolvedValue(pdfSession(1));
    mockRenderPdfPage.mockImplementationOnce(
      (
        _document,
        _textLayerClass,
        _pageNumber,
        _canvas,
        _textLayer,
        _scale,
        _rotation,
        signal,
      ) => {
        firstSignal = signal;
        return firstRender.promise;
      },
    );

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="pdf"
        src="/attachments/report.pdf"
        title="Report"
      />,
    );

    const stage = await screen.findByRole('region', { name: 'Report' });
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledOnce());
    await user.click(screen.getByRole('button', { name: 'Zoom in' }));

    expect(firstSignal?.aborted).toBe(true);
    expect(mockRenderPdfPage).toHaveBeenCalledOnce();
    expect(stage).toHaveAttribute('aria-busy', 'true');

    firstRender.resolve();

    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(stage).toHaveAttribute('aria-busy', 'false'));
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
  });

  it('restores ordinary exits after a morph close and controlled reopen', async () => {
    const user = userEvent.setup();
    const exitAnimation = deferred<void>();
    let holdExitAnimation = false;
    let closeExternally!: () => void;
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement) {
        return holdExitAnimation && this.closest('[data-exiting]')
          ? [{ finished: exitAnimation.promise }]
          : [];
      },
    });

    function ControlledViewer() {
      const [open, setOpen] = useState(true);
      closeExternally = () => setOpen(false);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Reopen externally
          </button>
          <DocumentViewer
            mediaType="image"
            onOpenChange={setOpen}
            open={open}
            src="/attachments/receipt.jpg"
            title="Receipt"
            transitionName="receipt-preview"
          />
        </>
      );
    }

    renderBreeze(<ControlledViewer />);
    const initialDialog = await screen.findByRole('dialog', {
      name: 'Receipt',
    });
    const image = initialDialog.querySelector('img');
    if (!image) throw new Error('The image preview was not rendered.');
    fireEvent.load(image);

    await user.click(
      within(initialDialog).getByRole('button', { name: 'Close' }),
    );
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-breeze-overlay][data-exiting]'),
      ).toBeNull(),
    );

    await user.click(screen.getByRole('button', { name: 'Reopen externally' }));
    const reopenedDialog = await screen.findByRole('dialog', {
      name: 'Receipt',
    });
    const reopenedImage = reopenedDialog.querySelector('img');
    if (!reopenedImage)
      throw new Error('The reopened image preview is missing.');
    fireEvent.load(reopenedImage);

    holdExitAnimation = true;
    act(closeExternally);
    const exitingOverlay = await waitFor(() => {
      const overlay = document.body.querySelector(
        '[data-breeze-overlay][data-exiting]',
      );
      if (!overlay) throw new Error('The normal overlay exit did not start.');
      return overlay;
    });
    expect(exitingOverlay).toHaveAttribute('data-breeze-scrim', 'true');
    expect(exitingOverlay).toContainElement(reopenedDialog);

    await act(async () => {
      exitAnimation.resolve();
      await exitAnimation.promise;
    });
  });

  it('reloads and resets a PDF when its auxiliary asset directories change', async () => {
    const user = userEvent.setup();
    const firstSession = pdfSession(2);
    const replacementSession = pdfSession(1);
    mockLoadPdfDocument
      .mockResolvedValueOnce(firstSession)
      .mockResolvedValueOnce(replacementSession);
    let changeCMapAssets!: () => void;

    function ConfigurableViewer() {
      const [cMapUrl, setCMapUrl] = useState('/assets/pdfjs/cmaps');
      changeCMapAssets = () => setCMapUrl('/assets/updated-pdfjs/cmaps');

      return (
        <DocumentViewer
          defaultOpen
          mediaType="pdf"
          pdfAssets={{ cMapUrl }}
          src="/attachments/report.pdf"
          title="Report"
        />
      );
    }

    renderBreeze(<ConfigurableViewer />);
    await user.click(await screen.findByRole('button', { name: 'Next page' }));
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();

    act(changeCMapAssets);

    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenNthCalledWith(
        2,
        '/attachments/report.pdf',
        expect.any(AbortSignal),
        {
          cMapUrl: '/assets/updated-pdfjs/cmaps',
          standardFontDataUrl: undefined,
        },
      ),
    );
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledTimes(3));
    expect(mockRenderPdfPage.mock.calls[2]?.[0]).toBe(
      replacementSession.document,
    );
    expect(mockRenderPdfPage.mock.calls[2]?.[2]).toBe(1);
    expect(screen.queryByText('Page 2 of 2')).toBeNull();
    expect(firstSession.dispose).toHaveBeenCalledOnce();
  });

  it('reveals an image error instead of leaving the loading skeleton', async () => {
    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="image"
        src="/attachments/missing.jpg"
        title="Missing image"
      />,
    );
    await waitFor(() =>
      expect(document.body.querySelector('img')).not.toBeNull(),
    );
    const image = document.body.querySelector('img');
    if (!image) throw new Error('The image preview was not rendered.');
    fireEvent.error(image);

    expect(
      await screen.findByText('The image preview could not be loaded.'),
    ).toBeInTheDocument();
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
  });

  it('applies zoom and rotation to browser-owned document frames', async () => {
    const user = userEvent.setup();
    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="document"
        src="/attachments/scan.tif"
        title="Scan"
      />,
    );
    const frame = await waitFor(() => {
      const current = document.body.querySelector('iframe');
      if (!current)
        throw new Error('The browser-owned document frame is absent.');
      return current;
    });
    expect(frame).toHaveAttribute('title', 'Scan');
    fireEvent.load(frame);
    const dialog = await screen.findByRole('dialog', { name: 'Scan' });

    await user.click(within(dialog).getByRole('button', { name: 'Zoom in' }));
    expect(frame.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1.25)',
    });
    await user.click(
      within(dialog).getByRole('button', { name: 'Rotate clockwise' }),
    );
    expect(frame.parentElement).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(90deg) scale(1.25)',
    });
  });

  it('keeps the Close control inside native fullscreen and toggles its exit label', async () => {
    const user = userEvent.setup();
    let activeFullscreenElement: Element | null = null;
    const requestFullscreen = vi.fn(() => {
      activeFullscreenElement = document.querySelector('.breeze-fullscreen');
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    });
    const exitFullscreen = vi.fn(() => {
      activeFullscreenElement = null;
      document.dispatchEvent(new Event('fullscreenchange'));
      return Promise.resolve();
    });
    Object.defineProperty(document, 'fullscreenEnabled', {
      configurable: true,
      value: true,
    });
    Object.defineProperty(document, 'fullscreenElement', {
      configurable: true,
      get: () => activeFullscreenElement,
    });
    Object.defineProperty(document, 'exitFullscreen', {
      configurable: true,
      value: exitFullscreen,
    });
    Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
      configurable: true,
      value: requestFullscreen,
    });

    renderBreeze(
      <DocumentViewer
        defaultOpen
        mediaType="image"
        src="/attachments/receipt.jpg"
        title="Receipt"
      />,
    );

    const dialog = await screen.findByRole('dialog', { name: 'Receipt' });
    const shell = document.querySelector('.breeze-fullscreen');
    expect(document.fullscreenEnabled).toBe(true);
    expect(shell).toHaveProperty('requestFullscreen');
    expect(
      shell?.contains(within(dialog).getByRole('button', { name: 'Close' })),
    ).toBe(true);
    const enter = await within(dialog).findByRole('button', {
      name: 'Full screen',
    });

    await user.click(enter);
    expect(requestFullscreen).toHaveBeenCalledOnce();
    expect(activeFullscreenElement).toBe(shell);
    const exit = await within(dialog).findByRole('button', {
      name: 'Exit full screen',
    });
    await user.click(exit);
    expect(exitFullscreen).toHaveBeenCalledOnce();
    expect(
      await within(dialog).findByRole('button', { name: 'Full screen' }),
    ).toBeInTheDocument();
  });

  it('waits for the AttachmentRow expand animation before starting the mode swap', async () => {
    const user = userEvent.setup();
    const expandFinished = deferred<void>();
    const transitions: { finished: Promise<void>; types: string[] }[] = [];
    class MockViewTransition {}
    Object.defineProperty(MockViewTransition.prototype, 'types', {
      configurable: true,
      value: new Set<string>(),
    });
    Object.defineProperty(window, 'ViewTransition', {
      configurable: true,
      value: MockViewTransition,
    });
    Object.defineProperty(window, 'CSS', {
      configurable: true,
      value: { supports: vi.fn(() => true) },
    });
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn((query: string) => ({
        addEventListener: vi.fn(),
        matches: false,
        media: query,
        removeEventListener: vi.fn(),
      })),
    });
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: (options: StartViewTransitionOptions) => {
        const types = Array.from(options.types ?? []);
        const update = options.update as
          | (() => void | Promise<void>)
          | undefined;
        const updateCallbackDone: Promise<void> = Promise.resolve().then(
          async () => {
            await update?.();
          },
        );
        const finished: Promise<void> = updateCallbackDone.then(async () => {
          if (types.includes('expand')) await expandFinished.promise;
        });
        transitions.push({ finished, types });
        return {
          finished,
          ready: Promise.resolve(),
          skipTransition: vi.fn(),
          types: new Set(types),
          updateCallbackDone,
        } satisfies ViewTransition;
      },
    });

    function AttachmentViewerExample() {
      const [open, setOpen] = useState(false);
      const transitionName = 'record-attachment-preview';

      return (
        <>
          <AttachmentRow
            fileType="document"
            filename="receipt.pdf"
            onOpen={() => setOpen(true)}
            sizeBytes={12_000}
            status="Uploaded"
            transitionName={transitionName}
          />
          <DocumentViewer
            mediaType="image"
            onOpenChange={setOpen}
            open={open}
            src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Crect width=%221%22 height=%221%22/%3E%3C/svg%3E"
            title="Receipt"
            transitionName={transitionName}
          />
        </>
      );
    }

    renderBreeze(<AttachmentViewerExample />);
    await user.click(screen.getByRole('button', { name: 'Open: receipt.pdf' }));
    await screen.findByRole('dialog', { name: 'Receipt' });
    await waitFor(() => expect(transitions).toHaveLength(1));

    const image = await waitFor(() => {
      const current = document.body.querySelector('img');
      if (!current) throw new Error('Expected the loaded image element.');
      return current;
    });
    fireEvent.load(image);

    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).toBeInTheDocument();
    expect(transitions.map(({ types }) => types)).toEqual([['expand']]);

    await act(async () => {
      expandFinished.resolve();
      await expandFinished.promise;
      await Promise.resolve();
    });

    await waitFor(() => expect(transitions).toHaveLength(2));
    expect(transitions.map(({ types }) => types)).toEqual([
      ['expand'],
      ['mode'],
    ]);
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );
  });

  it.each([false, true])(
    'morphs the attachment row into and out of a nested viewer (conditional mount: %s)',
    async (conditionalMount) => {
      const user = userEvent.setup();
      const transitionName = 'nested-record-preview';
      const snapshots: {
        next: string[];
        old: string[];
        types: string[];
      }[] = [];
      class MockViewTransition {}
      Object.defineProperty(MockViewTransition.prototype, 'types', {
        configurable: true,
        value: new Set<string>(),
      });
      Object.defineProperty(window, 'ViewTransition', {
        configurable: true,
        value: MockViewTransition,
      });
      Object.defineProperty(window, 'CSS', {
        configurable: true,
        value: { supports: vi.fn(() => true) },
      });
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: vi.fn((query: string) => ({
          addEventListener: vi.fn(),
          matches: false,
          media: query,
          removeEventListener: vi.fn(),
        })),
      });
      const collect = () =>
        Array.from(
          document.querySelectorAll<HTMLElement>(
            '[data-breeze-transition-enabled="true"][data-breeze-transition-name]',
          ),
        )
          .filter(
            (element) =>
              element.dataset.breezeTransitionName === transitionName,
          )
          .map((element) => {
            if (element.querySelector('[aria-label="Zoom in"]')) {
              return element.querySelector('[aria-label="Loading document"]')
                ? 'viewer-skeleton'
                : 'viewer';
            }
            return 'attachment';
          });
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: (options: StartViewTransitionOptions) => {
          const update = options.update as
            | (() => void | Promise<void>)
            | undefined;
          const snapshot = {
            next: [] as string[],
            old: collect(),
            types: Array.from(options.types ?? []),
          };
          const updateCallbackDone = Promise.resolve().then(async () => {
            await update?.();
            snapshot.next = collect();
          });
          const finished = updateCallbackDone;
          snapshots.push(snapshot);
          return {
            finished,
            ready: Promise.resolve(),
            skipTransition: vi.fn(),
            types: new Set(snapshot.types),
            updateCallbackDone,
          } satisfies ViewTransition;
        },
      });

      function AttachmentViewerExample() {
        const [open, setOpen] = useState(false);
        const [mounted, setMounted] = useState(!conditionalMount);
        const showViewer = () => {
          if (conditionalMount) setMounted(true);
          setOpen(true);
        };

        return (
          <Drawer
            defaultOpen
            title="Account record"
            trigger="Open account record"
          >
            <AttachmentRow
              fileType="document"
              filename="receipt.pdf"
              onOpen={showViewer}
              sizeBytes={12_000}
              status="Uploaded"
              transitionName={transitionName}
            />
            {mounted ? (
              <DocumentViewer
                mediaType="image"
                onOpenChange={setOpen}
                open={open}
                src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%221%22 height=%221%22%3E%3Crect width=%221%22 height=%221%22/%3E%3C/svg%3E"
                title="Receipt"
                transitionName={transitionName}
              />
            ) : null}
          </Drawer>
        );
      }

      renderBreeze(<AttachmentViewerExample />);
      const row = await screen.findByRole('button', {
        name: 'Open: receipt.pdf',
      });
      await user.click(row);
      const dialog = await screen.findByRole('dialog', { name: 'Receipt' });
      const image = await waitFor(() => {
        const current = dialog.querySelector('img');
        if (!current) throw new Error('Expected the image preview.');
        return current;
      });
      fireEvent.load(image);
      await waitFor(() =>
        expect(
          dialog.querySelector('[aria-label="Loading document"]'),
        ).not.toBeInTheDocument(),
      );

      const expandSnapshots = () =>
        snapshots.filter(({ types }) => types.includes('expand'));
      await waitFor(() => expect(expandSnapshots()).toHaveLength(1));
      expect(expandSnapshots()[0]).toMatchObject({
        next: ['viewer-skeleton'],
        old: ['attachment'],
      });

      await user.keyboard('{Escape}');
      await waitFor(() => expect(expandSnapshots()).toHaveLength(2));
      expect(expandSnapshots()[1]).toMatchObject({
        next: ['attachment'],
        old: ['viewer'],
      });
      await waitFor(() => expect(row).toHaveFocus());
    },
  );

  it('resets the page when the opened source changes', async () => {
    const user = userEvent.setup();
    mockLoadPdfDocument
      .mockResolvedValueOnce(pdfSession(2))
      .mockResolvedValueOnce(pdfSession(1));

    function SwitchableViewer() {
      const [src, setSrc] = useState('/attachments/first.pdf');

      return (
        <>
          <button
            onClick={() => setSrc('/attachments/second.pdf')}
            type="button"
          >
            Load second attachment
          </button>
          <DocumentViewer
            defaultOpen
            mediaType="pdf"
            src={src}
            title="Report"
          />
        </>
      );
    }

    renderBreeze(<SwitchableViewer />);
    await user.click(await screen.findByRole('button', { name: 'Next page' }));
    expect(await screen.findByText('Page 2 of 2')).toBeInTheDocument();

    const loadSecondButton = document.body.querySelector(
      '[data-breeze-root] button',
    );
    if (!loadSecondButton)
      throw new Error('Expected the source switch button.');
    await user.click(loadSecondButton);
    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenCalledWith(
        '/attachments/second.pdf',
        expect.any(AbortSignal),
        undefined,
      ),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole('button', { name: 'Next page' }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.queryByText('Page 2 of 2')).toBeNull();
    expect(mockRenderPdfPage).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      1,
      expect.any(HTMLCanvasElement),
      expect.any(HTMLDivElement),
      1,
      0,
      expect.any(AbortSignal),
      expect.any(Number),
    );
  });

  it('retries PDF.js after closing a native-frame fallback and reopening', async () => {
    const user = userEvent.setup();
    mockLoadPdfDocument
      .mockRejectedValueOnce(new Error('The optional peer is unavailable.'))
      .mockResolvedValueOnce(pdfSession(1));

    function ReopenViewer() {
      const [open, setOpen] = useState(true);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open attachment preview
          </button>
          <DocumentViewer
            mediaType="pdf"
            onOpenChange={setOpen}
            open={open}
            src="/attachments/report.pdf"
            title="Report"
          />
        </>
      );
    }

    renderBreeze(<ReopenViewer />);
    await screen.findByText(
      'The PDF preview is unavailable. The browser is opening the original file.',
    );
    const fallbackFrame = document.body.querySelector('iframe');
    expect(fallbackFrame).not.toBeNull();
    if (!fallbackFrame) throw new Error('Expected the native PDF fallback.');
    fireEvent.load(fallbackFrame);

    await user.click(await screen.findByRole('button', { name: 'Close' }));
    const reopenButton = document.body.querySelector(
      '[data-breeze-root] button',
    );
    if (!reopenButton) throw new Error('Expected the attachment open button.');
    await user.click(reopenButton);

    await waitFor(() => expect(mockLoadPdfDocument).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(document.body.querySelector('canvas')).not.toBeNull(),
    );
    expect(document.body.querySelector('iframe')).toBeNull();
    expect(mockRenderPdfPage).toHaveBeenCalledOnce();
  });

  it('disposes and reloads a successful PDF session after close and reopen', async () => {
    const user = userEvent.setup();
    const firstSession = pdfSession(1);
    const secondSession = pdfSession(1);
    mockLoadPdfDocument
      .mockResolvedValueOnce(firstSession)
      .mockResolvedValueOnce(secondSession);

    function ReopenViewer() {
      const [open, setOpen] = useState(true);

      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Open attachment preview
          </button>
          <DocumentViewer
            mediaType="pdf"
            onOpenChange={setOpen}
            open={open}
            src="/attachments/report.pdf"
            title="Report"
          />
        </>
      );
    }

    renderBreeze(<ReopenViewer />);
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledOnce());
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );

    await user.click(await screen.findByRole('button', { name: 'Close' }));
    await waitFor(() => expect(firstSession.dispose).toHaveBeenCalledOnce());
    const reopenButton = document.body.querySelector(
      '[data-breeze-root] button',
    );
    if (!reopenButton) throw new Error('Expected the attachment open button.');
    await user.click(reopenButton);

    await waitFor(() => expect(mockLoadPdfDocument).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledTimes(2));
    expect(mockRenderPdfPage.mock.calls[1]?.[0]).toBe(secondSession.document);
    expect(secondSession.dispose).not.toHaveBeenCalled();
    expect(document.body.querySelector('iframe')).toBeNull();
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
  });

  it('retains a painted PDF canvas through an externally controlled close', async () => {
    const session = pdfSession(1);
    const pendingExitAnimation = deferred<void>();
    Object.defineProperty(HTMLElement.prototype, 'getAnimations', {
      configurable: true,
      value(this: HTMLElement) {
        return this.closest('[data-exiting]')
          ? [{ finished: pendingExitAnimation.promise }]
          : [];
      },
    });
    mockLoadPdfDocument.mockResolvedValueOnce(session);
    type ViewerProps = {
      downloadName?: string;
      mediaType: 'image' | 'pdf';
      open: boolean;
      src: string;
      title: string;
    };
    let closeAndSwapExternally!: () => void;

    function ControlledViewer() {
      const [viewerState, setViewerState] = useState<ViewerProps>({
        mediaType: 'pdf',
        open: true,
        src: '/attachments/report.pdf',
        title: 'Original report',
      });
      closeAndSwapExternally = () =>
        setViewerState({
          downloadName: 'replacement-image.png',
          mediaType: 'image',
          open: false,
          src: '/attachments/replacement.png',
          title: 'Replacement image',
        });

      return (
        <DocumentViewer
          downloadName={viewerState.downloadName}
          mediaType={viewerState.mediaType}
          onOpenChange={(open) =>
            setViewerState((current) => ({ ...current, open }))
          }
          open={viewerState.open}
          src={viewerState.src}
          title={viewerState.title}
        />
      );
    }

    renderBreeze(<ControlledViewer />);

    const canvas = await waitFor(() => {
      const renderedCanvas = document.body.querySelector('canvas');
      if (!renderedCanvas) throw new Error('The PDF canvas was not rendered.');
      return renderedCanvas;
    });
    await waitFor(() =>
      expect(
        document.body.querySelector('[aria-label="Loading document"]'),
      ).not.toBeInTheDocument(),
    );

    act(() => closeAndSwapExternally());

    expect(document.body.querySelector('canvas')).toBe(canvas);
    expect(document.body.querySelector('img')).toBeNull();
    expect(
      screen.getByRole('dialog', { name: 'Original report' }),
    ).toBeInTheDocument();
    const filename = screen.getByText('Original report', { selector: 'span' });
    expect(filename).toHaveAttribute('title', 'Original report');
    expect(
      document.body.querySelector('a[download="Original report"]'),
    ).toHaveAttribute('href', '/attachments/report.pdf');
    expect(
      document.body.querySelector('[aria-label="Loading document"]'),
    ).not.toBeInTheDocument();
    expect(
      document.body.querySelector('[data-breeze-overlay][data-exiting]'),
    ).toBeInTheDocument();
    expect(session.dispose).toHaveBeenCalledOnce();
  });

  it('does not revive a stale native fallback when the source returns during a pending load', async () => {
    const replacementSession = pdfSession(1);
    const staleSecondSession = pdfSession(1);
    const pendingSecondSource = deferred<PdfSession>();
    const pendingThirdSource = deferred<PdfSession>();
    mockLoadPdfDocument
      .mockRejectedValueOnce(new Error('The optional peer is unavailable.'))
      .mockReturnValueOnce(pendingSecondSource.promise)
      .mockReturnValueOnce(pendingThirdSource.promise);
    let setSource!: (source: string) => void;

    function SwitchableViewer() {
      const [src, setSrc] = useState('/attachments/first.pdf');
      setSource = setSrc;

      return (
        <DocumentViewer defaultOpen mediaType="pdf" src={src} title="Report" />
      );
    }

    renderBreeze(<SwitchableViewer />);
    await screen.findByText(
      'The PDF preview is unavailable. The browser is opening the original file.',
    );
    expect(document.body.querySelector('iframe')).not.toBeNull();

    const zoomIn = await screen.findByRole('button', { name: 'Zoom in' });
    await userEvent.click(zoomIn);
    await userEvent.click(zoomIn);
    const mediaContent = document.body.querySelector(
      '.breeze-document-viewer-media-content',
    );
    expect(mediaContent).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(0deg) scale(1.5)',
    });

    act(() => setSource('/attachments/second.pdf'));
    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenNthCalledWith(
        2,
        '/attachments/second.pdf',
        expect.any(AbortSignal),
        undefined,
      ),
    );
    act(() => setSource('/attachments/first.pdf'));
    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenNthCalledWith(
        3,
        '/attachments/first.pdf',
        expect.any(AbortSignal),
        undefined,
      ),
    );

    expect(document.body.querySelector('iframe')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(mediaContent).toHaveStyle({
      transform: 'translate(-50%, -50%) rotate(0deg) scale(0.75)',
    });

    pendingThirdSource.resolve(replacementSession);
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledOnce());
    expect(document.body.querySelector('iframe')).toBeNull();

    pendingSecondSource.resolve(staleSecondSession);
    await waitFor(() =>
      expect(staleSecondSession.dispose).toHaveBeenCalledOnce(),
    );
  });

  it('does not reuse a disposed session when a pending source switch returns to its source', async () => {
    const firstSession = pdfSession(1);
    const replacementSession = pdfSession(1);
    const staleSecondSession = pdfSession(1);
    const pendingSecondSource = deferred<PdfSession>();
    const pendingThirdSource = deferred<PdfSession>();
    mockLoadPdfDocument
      .mockResolvedValueOnce(firstSession)
      .mockReturnValueOnce(pendingSecondSource.promise)
      .mockReturnValueOnce(pendingThirdSource.promise);
    let setSource!: (source: string) => void;

    function SwitchableViewer() {
      const [src, setSrc] = useState('/attachments/first.pdf');
      setSource = setSrc;

      return (
        <DocumentViewer defaultOpen mediaType="pdf" src={src} title="Report" />
      );
    }

    renderBreeze(<SwitchableViewer />);
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledOnce());

    act(() => setSource('/attachments/second.pdf'));
    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenNthCalledWith(
        2,
        '/attachments/second.pdf',
        expect.any(AbortSignal),
        undefined,
      ),
    );

    act(() => setSource('/attachments/first.pdf'));
    await waitFor(() =>
      expect(mockLoadPdfDocument).toHaveBeenNthCalledWith(
        3,
        '/attachments/first.pdf',
        expect.any(AbortSignal),
        undefined,
      ),
    );
    expect(firstSession.dispose).toHaveBeenCalledOnce();
    expect(mockRenderPdfPage).toHaveBeenCalledOnce();
    expect(mockLoadPdfDocument.mock.calls[0]?.[1]?.aborted).toBe(true);
    expect(mockLoadPdfDocument.mock.calls[1]?.[1]?.aborted).toBe(true);

    pendingThirdSource.resolve(replacementSession);
    await waitFor(() => expect(mockRenderPdfPage).toHaveBeenCalledTimes(2));
    expect(mockRenderPdfPage.mock.calls[1]?.[0]).toBe(
      replacementSession.document,
    );

    pendingSecondSource.resolve(staleSecondSession);
    await waitFor(() =>
      expect(staleSecondSession.dispose).toHaveBeenCalledOnce(),
    );
  });
});
