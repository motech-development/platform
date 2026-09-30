import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  startViewTransitionAndWait,
  useViewTransitionParticipant,
  waitForCurrentViewTransition,
} from '../../motion/view-transitions';
import OverlaySurface from '../../overlays/OverlaySurface';
import { Button } from '../../primitives/Button/Button';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { PdfSession } from './pdf-renderer';
import { loadPdfDocument, renderPdfPage } from './pdf-renderer';

const variants = {
  base: {
    actions:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-breeze-2',
    download:
      'breeze:inline-grid breeze:min-block-breeze-md breeze:place-items-center breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-transparent breeze:px-breeze-3 breeze:pbe-breeze-3 breeze:ps-breeze-3 breeze:pe-breeze-3 breeze:pbs-breeze-2 breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-brand-text breeze:underline breeze:underline-offset-2 breeze:hover:bg-breeze-brand-soft breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand',
    mediaBox: 'breeze:relative breeze:flex-none',
    mediaContent: 'breeze-document-viewer-media-content',
    pageStatus:
      'breeze:min-inline-size-[6rem] breeze:text-center breeze:text-breeze-sm breeze:tabular-nums breeze:text-breeze-ink-2',
    pdfPage:
      'breeze-pdf-page breeze:relative breeze:overflow-hidden breeze:bg-white breeze:shadow-overlay',
    root: 'breeze:flex breeze:block-size-full breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-col breeze:gap-breeze-3',
    skeletonLayer:
      'breeze:absolute breeze:inset-0 breeze:flex breeze:items-center breeze:justify-center',
    stage:
      'breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:items-[safe_center] breeze:justify-[safe_center] breeze:overflow-auto breeze:rounded-breeze-sm breeze:bg-breeze-sunken breeze:p-breeze-4',
    stageContent:
      'breeze:flex breeze:min-block-size-full breeze:min-inline-size-full breeze:items-[safe_center] breeze:justify-[safe_center]',
    textLayer: 'breeze-pdf-text-layer',
    toolbar:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:justify-between breeze:gap-breeze-3 breeze:border-breeze-line breeze:border-b breeze:pbe-breeze-3',
    toolbarSection:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-breeze-2',
    viewer:
      'breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:overflow-hidden',
    viewerFrame:
      'breeze:block breeze:block-size-full breeze:min-block-size-[24rem] breeze:inline-size-full breeze:border-0 breeze:bg-breeze-surface',
    viewerImage: 'breeze:block breeze:object-contain',
    viewerNotice:
      'breeze:m-0 breeze:text-breeze-xs breeze:leading-breeze-snug breeze:text-breeze-ink-3',
  },
  compound: {},
  size: {},
  state: {
    painted: {
      hidden: 'breeze:invisible breeze:absolute breeze:inset-0',
      visible: 'breeze:visible',
    },
  },
  variant: {},
} as const;

/** The content kind used to select the image, PDF or native frame renderer. */
export type DocumentViewerMediaType = 'document' | 'image' | 'pdf';

interface DocumentViewerBaseProps {
  /** Name used for the download and the labelled viewer dialog. */
  downloadName?: string;
  /** Selects a photograph, a PDF, or a browser-rendered document. */
  mediaType: DocumentViewerMediaType;
  /** Reports the semantic open state when the viewer changes it. */
  onOpenChange?: (open: boolean) => void;
  /** Called when the app-owned Replace toolbar action is activated. */
  onReplace?: () => void;
  /** Called when the app-owned Remove toolbar action is activated. */
  onRemove?: () => void;
  /** URL of the source image or document. */
  src: string;
  /** Visible title and accessible name for the viewer dialog. */
  title: string;
  /** Name shared with the AttachmentRow that opens this viewer. */
  transitionName?: string;
}

interface ControlledDocumentViewerProps {
  defaultOpen?: never;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

interface UncontrolledDocumentViewerProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  open?: never;
}

/** Props for an attachment preview dialog with built-in reading controls. */
export type DocumentViewerProps = DocumentViewerBaseProps &
  (ControlledDocumentViewerProps | UncontrolledDocumentViewerProps);

interface KeyedValue<T> {
  key: string;
  value: T;
}

interface KeyedAsset {
  failed: boolean;
  key: string;
  ready: boolean;
}

interface KeyedSize {
  height: number;
  key: string;
  width: number;
}

function getFullscreenTarget(element: HTMLElement) {
  return element.closest<HTMLElement>('.breeze-fullscreen') ?? element;
}

/**
 * Opens an image or document in a full-screen viewer with its own toolbar.
 *
 * @summary A modal attachment preview with lazy PDF rendering.
 */
export function DocumentViewer({
  defaultOpen = false,
  downloadName,
  mediaType,
  onOpenChange,
  onRemove,
  onReplace,
  open: controlledOpen,
  src,
  title,
  transitionName,
}: Readonly<DocumentViewerProps>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const participantName =
    transitionName?.trim() || `breeze-document-${reactId}`;
  const transitionRef = useViewTransitionParticipant({
    name: participantName,
    types: ['expand', 'mode'],
  });
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const setStageRef = useCallback(
    (element: HTMLDivElement | null) => {
      stageRef.current = element;
      const cleanup = transitionRef(element);

      if (!element) return cleanup;

      return () => {
        stageRef.current = null;
        cleanup?.();
      };
    },
    [transitionRef],
  );
  const [viewerElement, setViewerElement] = useState<HTMLDivElement | null>(
    null,
  );
  const setViewerRef = useCallback((element: HTMLDivElement | null) => {
    viewerRef.current = element;
    setViewerElement(element);
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const revealStartedRef = useRef<string | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const sourceKey = open ? JSON.stringify([mediaType, src]) : '';
  const [zoomState, setZoomState] = useState<KeyedValue<number>>({
    key: '',
    value: 1,
  });
  const [rotationState, setRotationState] = useState<KeyedValue<number>>({
    key: '',
    value: 0,
  });
  const [pageState, setPageState] = useState<KeyedValue<number>>({
    key: '',
    value: 1,
  });
  const zoom = zoomState.key === sourceKey ? zoomState.value : 1;
  const rotation = rotationState.key === sourceKey ? rotationState.value : 0;
  const pageNumber = pageState.key === sourceKey ? pageState.value : 1;
  const assetKey = JSON.stringify([sourceKey, pageNumber]);
  const [assetState, setAssetState] = useState<KeyedAsset>({
    failed: false,
    key: '',
    ready: false,
  });
  const [mediaSizeState, setMediaSizeState] = useState<KeyedSize>({
    height: 0,
    key: '',
    width: 0,
  });
  const mediaSize =
    mediaSizeState.key === assetKey
      ? mediaSizeState
      : { height: 0, key: assetKey, width: 0 };
  const assetReady = assetState.key === assetKey && assetState.ready;
  const assetFailed = assetState.key === assetKey && assetState.failed;
  const [transitionReadyKey, setTransitionReadyKey] = useState('');
  const transitionReady = transitionReadyKey === sourceKey && open;
  const [paintedKey, setPaintedKey] = useState('');
  const painted = paintedKey === assetKey && assetReady && open;
  const [revealedSourceKey, setRevealedSourceKey] = useState('');
  const [pdfSessionState, setPdfSessionState] = useState<{
    key: string;
    session: PdfSession;
  } | null>(null);
  const pdfSession =
    pdfSessionState?.key === sourceKey ? pdfSessionState.session : null;
  const [pdfFallbackKey, setPdfFallbackKey] = useState('');
  const pdfFallback = pdfFallbackKey === sourceKey && mediaType === 'pdf';
  const pageCount = pdfSession?.document.numPages ?? 0;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenAvailable =
    open &&
    typeof document !== 'undefined' &&
    document.fullscreenEnabled &&
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype.requestFullscreen === 'function';

  const changeOpen = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (open) return;

    setZoomState({ key: '', value: 1 });
    setRotationState({ key: '', value: 0 });
    setPageState({ key: '', value: 1 });
    setAssetState({ failed: false, key: '', ready: false });
    setMediaSizeState({ height: 0, key: '', width: 0 });
    setPdfSessionState(null);
    setPdfFallbackKey('');
    setTransitionReadyKey('');
    setPaintedKey('');
    setRevealedSourceKey('');
    revealStartedRef.current = null;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    let active = true;
    waitForCurrentViewTransition()
      .then(() => {
        if (active) setTransitionReadyKey(sourceKey);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [open, sourceKey]);

  useEffect(() => {
    if (!open || mediaType !== 'pdf') return undefined;

    let active = true;
    let loadedSession: PdfSession | null = null;

    loadPdfDocument(src)
      .then((session) => {
        loadedSession = session;
        if (!active) {
          session.dispose();
          return;
        }

        setPdfSessionState({ key: sourceKey, session });
      })
      .catch(() => {
        if (!active) return;
        setPdfFallbackKey(sourceKey);
      });

    return () => {
      active = false;
      loadedSession?.dispose();
    };
  }, [mediaType, open, sourceKey, src]);

  useEffect(() => {
    if (
      !open ||
      mediaType !== 'pdf' ||
      pdfFallback ||
      !pdfSession ||
      !canvasRef.current ||
      !textLayerRef.current
    ) {
      return undefined;
    }

    const controller = new AbortController();
    const canvas = canvasRef.current;
    const textLayer = textLayerRef.current;

    renderPdfPage(
      pdfSession.document,
      pdfSession.textLayer,
      pageNumber,
      canvas,
      textLayer,
      1,
      0,
      controller.signal,
    )
      .then(() => {
        if (!controller.signal.aborted) {
          const renderedCanvas = canvasRef.current;
          if (renderedCanvas) {
            setMediaSizeState({
              height: renderedCanvas.height,
              key: assetKey,
              width: renderedCanvas.width,
            });
          }
          setAssetState({ failed: false, key: assetKey, ready: true });
        }
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        setPdfFallbackKey(sourceKey);
        setAssetState({ failed: false, key: assetKey, ready: false });
      });

    return () => controller.abort();
  }, [
    assetKey,
    mediaType,
    open,
    pageNumber,
    pdfFallback,
    pdfSession,
    sourceKey,
  ]);

  useEffect(() => {
    if (
      !open ||
      !assetReady ||
      !transitionReady ||
      painted ||
      revealStartedRef.current === assetKey
    ) {
      return;
    }

    revealStartedRef.current = assetKey;
    const reveal = () => {
      setPaintedKey(assetKey);
      setRevealedSourceKey(sourceKey);
    };
    const revealInTransition = () =>
      new Promise<void>((resolve) => {
        queueMicrotask(() => {
          flushSync(() => {
            setPaintedKey(assetKey);
            setRevealedSourceKey(sourceKey);
          });
          resolve();
        });
      });

    if (!transitionName?.trim() || revealedSourceKey === sourceKey) {
      reveal();
      return;
    }

    startViewTransitionAndWait(revealInTransition, ['mode']).catch(() => {
      revealStartedRef.current = null;
      flushSync(() => {
        setPaintedKey(assetKey);
        setRevealedSourceKey(sourceKey);
      });
    });
  }, [
    assetKey,
    assetReady,
    open,
    painted,
    revealedSourceKey,
    sourceKey,
    transitionName,
    transitionReady,
  ]);

  useEffect(() => {
    const element = viewerElement;
    const ownerDocument = element?.ownerDocument;
    if (!open || !element || !ownerDocument) {
      setIsFullscreen(false);
      return undefined;
    }

    const target = getFullscreenTarget(element);
    const update = () => {
      setIsFullscreen(ownerDocument.fullscreenElement === target);
    };
    update();
    ownerDocument.addEventListener('fullscreenchange', update);
    return () => ownerDocument.removeEventListener('fullscreenchange', update);
  }, [open, viewerElement]);

  const isPdfCanvas = mediaType === 'pdf' && !pdfFallback;
  const rotated = rotation % 180 !== 0;
  const boxWidth = (rotated ? mediaSize.height : mediaSize.width) * zoom;
  const boxHeight = (rotated ? mediaSize.width : mediaSize.height) * zoom;
  const mediaBoxStyle = { height: boxHeight, width: boxWidth };
  const mediaContentStyle = {
    height: mediaSize.height,
    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${zoom})`,
    transformOrigin: 'center',
    width: mediaSize.width,
  };
  const filename = downloadName?.trim() || title;
  const showFrame = mediaType === 'document' || pdfFallback;

  const fitImageToStage = (image: HTMLImageElement) => {
    const stage = stageRef.current;
    const bounds = stage?.getBoundingClientRect();
    const naturalWidth = image.naturalWidth || 1;
    const naturalHeight = image.naturalHeight || 1;
    const maxWidth = bounds?.width || naturalWidth;
    const maxHeight = bounds?.height || naturalHeight;
    const fit = Math.min(1, maxWidth / naturalWidth, maxHeight / naturalHeight);

    setMediaSizeState({
      height: naturalHeight * fit,
      key: assetKey,
      width: naturalWidth * fit,
    });
  };

  const fitFrameToStage = () => {
    const bounds = stageRef.current?.getBoundingClientRect();
    setMediaSizeState({
      height: bounds?.height || 720,
      key: assetKey,
      width: bounds?.width || 1024,
    });
  };

  const renderMediaContent = () => {
    if (mediaType === 'image') {
      return (
        <img
          alt={title}
          className={variants.base.viewerImage}
          key={assetKey}
          onError={() =>
            setAssetState({ failed: true, key: assetKey, ready: true })
          }
          onLoad={(event) => {
            fitImageToStage(event.currentTarget);
            setAssetState({ failed: false, key: assetKey, ready: true });
          }}
          src={src}
          style={{ height: mediaSize.height, width: mediaSize.width }}
        />
      );
    }

    if (isPdfCanvas && pdfSession) {
      return (
        <div className={variants.base.pdfPage} key={assetKey}>
          <canvas aria-hidden="true" ref={canvasRef} />
          <div
            aria-hidden="true"
            className={variants.base.textLayer}
            ref={textLayerRef}
          />
        </div>
      );
    }

    if (showFrame) {
      return (
        <iframe
          className={variants.base.viewerFrame}
          key={assetKey}
          onLoad={() => {
            fitFrameToStage();
            setAssetState({ failed: false, key: assetKey, ready: true });
          }}
          src={src}
          title={title}
        />
      );
    }

    return null;
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Keyboard users need to focus this scroll region. */
  return (
    <OverlaySurface
      fullScreen
      kind="dialog"
      onOpenChange={changeOpen}
      open={open}
      title={title}
    >
      <div className={variants.base.root} ref={setViewerRef}>
        <div className={variants.base.toolbar}>
          <div className={variants.base.toolbarSection}>
            <Button
              disabled={zoom <= 0.5}
              onAction={() =>
                setZoomState({
                  key: sourceKey,
                  value: Math.max(0.5, zoom - 0.25),
                })
              }
              size="sm"
              variant="secondary"
            >
              {messages.documentViewerZoomOut}
            </Button>
            <Button
              disabled={zoom >= 3}
              onAction={() =>
                setZoomState({
                  key: sourceKey,
                  value: Math.min(3, zoom + 0.25),
                })
              }
              size="sm"
              variant="secondary"
            >
              {messages.documentViewerZoomIn}
            </Button>
            <Button
              onAction={() =>
                setRotationState({
                  key: sourceKey,
                  value: (rotation + 90) % 360,
                })
              }
              size="sm"
              variant="secondary"
            >
              {messages.documentViewerRotate}
            </Button>
            {isPdfCanvas && pageCount > 1 ? (
              <div className={variants.base.actions}>
                <Button
                  disabled={pageNumber <= 1}
                  onAction={() =>
                    setPageState({ key: sourceKey, value: pageNumber - 1 })
                  }
                  size="sm"
                  variant="secondary"
                >
                  {messages.documentViewerPreviousPage}
                </Button>
                <span
                  aria-live="polite"
                  className={variants.base.pageStatus}
                  lang={getMessageLocale('documentViewerPage')}
                >
                  {messages.documentViewerPage
                    .replace('{current}', String(pageNumber))
                    .replace('{total}', String(pageCount))}
                </span>
                <Button
                  disabled={pageNumber >= pageCount}
                  onAction={() =>
                    setPageState({ key: sourceKey, value: pageNumber + 1 })
                  }
                  size="sm"
                  variant="secondary"
                >
                  {messages.documentViewerNextPage}
                </Button>
              </div>
            ) : null}
          </div>
          <div className={variants.base.toolbarSection}>
            <a
              className={variants.base.download}
              download={filename}
              href={src}
              lang={getMessageLocale('documentViewerDownload')}
            >
              {messages.documentViewerDownload}
            </a>
            {onReplace ? (
              <Button onAction={onReplace} size="sm" variant="secondary">
                {messages.documentViewerReplace}
              </Button>
            ) : null}
            {onRemove ? (
              <Button onAction={onRemove} size="sm" variant="danger">
                {messages.documentViewerRemove}
              </Button>
            ) : null}
            {fullscreenAvailable ? (
              <Button
                onAction={() => {
                  const element = viewerRef.current;
                  const ownerDocument = element?.ownerDocument;

                  if (!element || !ownerDocument) return;
                  const target = getFullscreenTarget(element);
                  if (ownerDocument.fullscreenElement === target) {
                    ownerDocument.exitFullscreen?.().catch(() => undefined);
                  } else {
                    target.requestFullscreen?.().catch(() => undefined);
                  }
                }}
                size="sm"
                variant="quiet"
              >
                {isFullscreen
                  ? messages.documentViewerExitFullScreen
                  : messages.documentViewerFullScreen}
              </Button>
            ) : null}
          </div>
        </div>
        <div className={variants.base.viewer}>
          <div
            aria-busy={!painted}
            aria-label={title}
            className={variants.base.stage}
            ref={setStageRef}
            role="region"
            tabIndex={0}
          >
            <div
              aria-hidden={!painted}
              className={[
                variants.base.stageContent,
                variants.state.painted[painted ? 'visible' : 'hidden'],
              ].join(' ')}
            >
              <div className={variants.base.mediaBox} style={mediaBoxStyle}>
                <div
                  className={variants.base.mediaContent}
                  style={mediaContentStyle}
                >
                  {renderMediaContent()}
                </div>
              </div>
            </div>
            {!painted ? (
              <div className={variants.base.skeletonLayer}>
                <Skeleton
                  blockSize="100%"
                  inlineSize="100%"
                  label={messages.documentViewerLoading}
                  shape="rectangle"
                />
              </div>
            ) : null}
          </div>
        </div>
        <p className={variants.base.viewerNotice}>
          {messages.documentViewerAccessibility}
        </p>
        {assetFailed ? (
          <p aria-live="polite" className={variants.base.viewerNotice}>
            {messages.documentViewerImageUnavailable}
          </p>
        ) : null}
        {pdfFallback ? (
          <p aria-live="polite" className={variants.base.viewerNotice}>
            {messages.documentViewerFallback}
          </p>
        ) : null}
      </div>
    </OverlaySurface>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
}
