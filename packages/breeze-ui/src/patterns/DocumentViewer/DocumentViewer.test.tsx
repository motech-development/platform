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
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockLoadPdfDocument.mockReset();
    mockRenderPdfPage.mockReset();
    mockRenderPdfPage.mockResolvedValue();
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
      ),
    );
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
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
});
