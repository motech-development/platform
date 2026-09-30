import {
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import {
  startViewTransitionAndWait,
  useViewTransitionParticipant,
  waitForCurrentViewTransition,
} from '../../motion/view-transitions';
import { ParentOverlayContext } from '../../overlays/OverlayStack';
import OverlaySurface from '../../overlays/OverlaySurface';
import { Button } from '../../primitives/Button/Button';
import { Skeleton } from '../../primitives/Skeleton/Skeleton';
import { useBreezeContext } from '../../provider/BreezeContext';
import type { PdfSession } from './pdf-renderer';
import { loadPdfDocument, renderPdfPage } from './pdf-renderer';

const variants = {
  base: {
    mediaBox: 'breeze:relative breeze:flex-none',
    mediaContent: 'breeze-document-viewer-media-content',
    pageStatus:
      'breeze:min-inline-size-[6rem] breeze:text-center breeze:text-breeze-sm breeze:tabular-nums breeze:text-breeze-ink-2',
    pageToolbar:
      'breeze:flex breeze:items-center breeze:justify-center breeze:gap-breeze-2 breeze:border-breeze-line breeze:border-b breeze:bg-breeze-canvas breeze:px-breeze-3 breeze:py-breeze-2',
    pdfPage:
      'breeze-pdf-page breeze:relative breeze:overflow-hidden breeze:bg-white breeze:shadow-overlay',
    root: 'breeze:flex breeze:block-size-full breeze:inline-size-full breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-col breeze:bg-breeze-canvas',
    skeletonLayer:
      'breeze:absolute breeze:inset-0 breeze:flex breeze:items-center breeze:justify-center',
    stage:
      'breeze-document-viewer-stage breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:overflow-auto breeze:rounded-breeze-sm breeze:bg-breeze-sunken breeze:p-breeze-4',
    stageContent:
      'breeze-document-viewer-stage-content breeze:flex breeze:min-block-size-full breeze:min-inline-size-full',
    textLayer: 'breeze-pdf-text-layer',
    toolbar:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px] breeze:border-breeze-line breeze:border-b breeze:bg-breeze-raised breeze:px-breeze-3 breeze:py-breeze-2',
    toolbarLink:
      'breeze:inline-flex breeze:min-block-breeze-sm breeze:items-center breeze:justify-center breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:px-breeze-3 breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:no-underline breeze:hover:bg-breeze-sunken breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    toolbarSection:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px]',
    toolbarTitle:
      'breeze:grow breeze:min-inline-size-0 breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink-2 breeze:max-breeze-md:basis-full breeze:max-breeze-md:grow-0 breeze:max-breeze-md:shrink-0',
    viewer:
      'breeze:relative breeze:flex breeze:min-block-size-0 breeze:min-inline-size-0 breeze:flex-1 breeze:flex-col breeze:overflow-hidden',
    viewerFrame:
      'breeze:block breeze:block-size-full breeze:min-block-size-0 breeze:inline-size-full breeze:border-0 breeze:bg-breeze-surface',
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
  key: string | null;
  value: T;
}

interface KeyedAsset {
  failed: boolean;
  key: string | null;
  ready: boolean;
}

interface KeyedSize {
  height: number;
  key: string | null;
  width: number;
}

interface ExitingViewerState {
  assetKey: string | null;
  downloadName?: string;
  mediaType: DocumentViewerMediaType;
  pageNumber: number;
  rotation: number;
  src: string;
  sourceKey: string;
  title: string;
  zoom: number;
}

function getFullscreenTarget(element: HTMLElement) {
  return element.closest<HTMLElement>('.breeze-fullscreen') ?? element;
}

interface ViewerModeMarker {
  count: number;
  previous: string | null;
}

const viewerModeMarkers = new WeakMap<HTMLElement, ViewerModeMarker>();

function startViewerModeTransition(
  element: HTMLElement | null,
  update: () => Promise<void>,
) {
  if (element) {
    const marker = viewerModeMarkers.get(element);
    if (marker) marker.count += 1;
    else {
      viewerModeMarkers.set(element, {
        count: 1,
        previous: element.getAttribute('data-breeze-viewer-mode-transition'),
      });
    }
    element.setAttribute('data-breeze-viewer-mode-transition', '');
  }
  const restoreMarker = () => {
    if (!element) return;
    const marker = viewerModeMarkers.get(element);
    if (!marker) return;
    marker.count -= 1;
    if (marker.count > 0) return;
    viewerModeMarkers.delete(element);
    if (marker.previous === null)
      element.removeAttribute('data-breeze-viewer-mode-transition');
    else
      element.setAttribute(
        'data-breeze-viewer-mode-transition',
        marker.previous,
      );
  };

  try {
    return startViewTransitionAndWait(update, ['mode']).finally(restoreMarker);
  } catch (error) {
    restoreMarker();
    throw error;
  }
}

interface DocumentViewerPanelProps {
  children: ReactNode;
  name: string;
  onRoot: (element: HTMLDivElement | null) => void;
}

function DocumentViewerPanel({
  children,
  name,
  onRoot,
}: Readonly<DocumentViewerPanelProps>) {
  const transitionRef = useViewTransitionParticipant({
    name,
    types: ['expand', 'mode'],
  });
  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      const cleanup = transitionRef(element);
      onRoot(element);

      if (!element) return cleanup;

      return () => {
        onRoot(null);
        cleanup?.();
      };
    },
    [onRoot, transitionRef],
  );

  return (
    <div className={variants.base.root} ref={setRootRef}>
      {children}
    </div>
  );
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
  const rotateAccessibleLabelId = `${reactId}-rotate-accessible-label`;
  const participantName =
    transitionName?.trim() || `breeze-document-${reactId}`;
  const parentOverlay = useContext(ParentOverlayContext);
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const setStageRef = useCallback((element: HTMLDivElement | null) => {
    stageRef.current = element;
    return () => {
      stageRef.current = null;
    };
  }, []);
  const [viewerElement, setViewerElement] = useState<HTMLDivElement | null>(
    null,
  );
  const setViewerRef = useCallback((element: HTMLDivElement | null) => {
    viewerRef.current = element;
    setViewerElement(element);
  }, []);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const revealStartedRef = useRef<string | null>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [closingTransition, setClosingTransition] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const effectiveOpen = open && parentOverlay?.open !== false;
  const sourceSignature = effectiveOpen
    ? JSON.stringify([mediaType, src])
    : null;
  const [sourceLifecycle, setSourceLifecycle] = useState({
    generation: 0,
    signature: null as string | null,
  });
  useLayoutEffect(() => {
    if (sourceLifecycle.signature === sourceSignature) return;
    setSourceLifecycle((current) => ({
      generation: current.generation + 1,
      signature: sourceSignature,
    }));
  }, [sourceLifecycle.signature, sourceSignature]);
  const sourceKey =
    effectiveOpen && sourceLifecycle.signature === sourceSignature
      ? `${reactId}:${sourceLifecycle.generation}`
      : null;
  const [zoomState, setZoomState] = useState<KeyedValue<number>>({
    key: null,
    value: 1,
  });
  const [rotationState, setRotationState] = useState<KeyedValue<number>>({
    key: null,
    value: 0,
  });
  const [pageState, setPageState] = useState<KeyedValue<number>>({
    key: null,
    value: 1,
  });
  const zoom = zoomState.key === sourceKey ? zoomState.value : 1;
  const rotation = rotationState.key === sourceKey ? rotationState.value : 0;
  const pageNumber = pageState.key === sourceKey ? pageState.value : 1;
  const assetKey = sourceKey ? JSON.stringify([sourceKey, pageNumber]) : null;
  const [exitState, setExitState] = useState<ExitingViewerState | null>(null);
  const [lastViewerState, setLastViewerState] =
    useState<ExitingViewerState | null>(null);
  const retainedViewerState = exitState ?? lastViewerState;
  const contentSourceKey = effectiveOpen
    ? sourceKey
    : retainedViewerState?.sourceKey ?? null;
  const contentAssetKey = effectiveOpen
    ? assetKey
    : retainedViewerState?.assetKey ?? null;
  const contentPageNumber = effectiveOpen
    ? pageNumber
    : retainedViewerState?.pageNumber ?? 1;
  const contentZoom = effectiveOpen ? zoom : retainedViewerState?.zoom ?? 1;
  const contentRotation = effectiveOpen
    ? rotation
    : retainedViewerState?.rotation ?? 0;
  const contentMediaType = effectiveOpen
    ? mediaType
    : retainedViewerState?.mediaType ?? mediaType;
  const contentSrc = effectiveOpen ? src : retainedViewerState?.src ?? src;
  const contentTitle = effectiveOpen
    ? title
    : retainedViewerState?.title ?? title;
  const contentDownloadName =
    effectiveOpen || !retainedViewerState
      ? downloadName
      : retainedViewerState.downloadName;
  const activeViewerStateRef = useRef<ExitingViewerState | null>(null);
  const [assetState, setAssetState] = useState<KeyedAsset>({
    failed: false,
    key: null,
    ready: false,
  });
  const [mediaSizeState, setMediaSizeState] = useState<KeyedSize>({
    height: 0,
    key: null,
    width: 0,
  });
  const mediaSize =
    mediaSizeState.key === contentAssetKey
      ? mediaSizeState
      : { height: 0, key: contentAssetKey, width: 0 };
  const assetReady = assetState.key === contentAssetKey && assetState.ready;
  const assetFailed = assetState.key === contentAssetKey && assetState.failed;
  const [transitionReadyKey, setTransitionReadyKey] = useState<string | null>(
    null,
  );
  const transitionReady = transitionReadyKey === sourceKey && effectiveOpen;
  const [paintedKey, setPaintedKey] = useState<string | null>(null);
  const painted =
    paintedKey === contentAssetKey && assetReady && contentSourceKey !== null;
  const [revealedSourceKey, setRevealedSourceKey] = useState<string | null>(
    null,
  );
  const [pdfSessionState, setPdfSessionState] = useState<{
    key: string;
    session: PdfSession;
  } | null>(null);
  const pdfSession =
    pdfSessionState?.key === contentSourceKey ? pdfSessionState.session : null;
  const [pdfFallbackKey, setPdfFallbackKey] = useState<string | null>(null);
  const pdfFallback =
    contentSourceKey !== null &&
    pdfFallbackKey === contentSourceKey &&
    contentMediaType === 'pdf';
  const pageCount = pdfSession?.document.numPages ?? 0;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenAvailable =
    effectiveOpen &&
    typeof document !== 'undefined' &&
    document.fullscreenEnabled &&
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype.requestFullscreen === 'function';
  const currentViewerState = useMemo(
    () =>
      sourceKey && assetKey
        ? {
            assetKey,
            downloadName,
            mediaType,
            pageNumber,
            rotation,
            sourceKey,
            src,
            title,
            zoom,
          }
        : null,
    [
      assetKey,
      downloadName,
      mediaType,
      pageNumber,
      rotation,
      sourceKey,
      src,
      title,
      zoom,
    ],
  );

  useLayoutEffect(() => {
    if (effectiveOpen && sourceKey && currentViewerState) {
      activeViewerStateRef.current = currentViewerState;
      setLastViewerState((previous) =>
        previous?.assetKey === assetKey &&
        previous.downloadName === downloadName &&
        previous.mediaType === mediaType &&
        previous.pageNumber === pageNumber &&
        previous.rotation === rotation &&
        previous.sourceKey === sourceKey &&
        previous.src === src &&
        previous.title === title &&
        previous.zoom === zoom
          ? previous
          : currentViewerState,
      );
      if (exitState) setExitState(null);
      return;
    }

    if (activeViewerStateRef.current) {
      if (!exitState) setExitState(activeViewerStateRef.current);
      activeViewerStateRef.current = null;
    }
  }, [
    assetKey,
    currentViewerState,
    downloadName,
    effectiveOpen,
    exitState,
    mediaType,
    pageNumber,
    rotation,
    sourceKey,
    src,
    title,
    zoom,
  ]);

  const applyOpenChange = (nextOpen: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };
  const changeOpen = (nextOpen: boolean) => {
    if (nextOpen) {
      setClosingTransition(false);
      setExitState(null);
      applyOpenChange(true);
      return;
    }

    if (!open || !transitionName?.trim() || parentOverlay?.open === false) {
      setClosingTransition(false);
      if (currentViewerState) {
        setExitState(currentViewerState);
      }
      applyOpenChange(false);
      return;
    }

    let closed = false;
    const closeInTransition = () => {
      if (closed) return;
      closed = true;
      flushSync(() => {
        setClosingTransition(true);
        if (currentViewerState) {
          setExitState(currentViewerState);
        }
        applyOpenChange(false);
      });
    };

    try {
      startViewTransitionAndWait(closeInTransition, ['expand']).catch(
        closeInTransition,
      );
    } catch {
      closeInTransition();
    }
  };

  useEffect(() => {
    if (!effectiveOpen || !sourceKey) return undefined;

    let active = true;
    waitForCurrentViewTransition()
      .then(() => {
        if (active) setTransitionReadyKey(sourceKey);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, [effectiveOpen, sourceKey]);

  useEffect(() => {
    if (!effectiveOpen || !sourceKey || mediaType !== 'pdf') return undefined;

    let active = true;
    let loadedSession: PdfSession | null = null;
    const controller = new AbortController();

    loadPdfDocument(src, controller.signal)
      .then((session) => {
        loadedSession = session;
        if (!active || controller.signal.aborted) {
          session.dispose();
          return;
        }

        setPdfSessionState({ key: sourceKey, session });
      })
      .catch(() => {
        if (!active || controller.signal.aborted) return;
        setPdfFallbackKey(sourceKey);
      });

    return () => {
      active = false;
      controller.abort();
      loadedSession?.dispose();
    };
  }, [effectiveOpen, mediaType, sourceKey, src]);

  useEffect(() => {
    if (
      !effectiveOpen ||
      !sourceKey ||
      !assetKey ||
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
    effectiveOpen,
    mediaType,
    pageNumber,
    pdfFallback,
    pdfSession,
    sourceKey,
  ]);

  useEffect(() => {
    if (
      !effectiveOpen ||
      !sourceKey ||
      !assetKey ||
      !assetReady ||
      !transitionReady ||
      painted ||
      revealStartedRef.current === assetKey
    ) {
      return undefined;
    }

    let active = true;
    revealStartedRef.current = assetKey;
    const reveal = () => {
      if (!active) return;
      setPaintedKey(assetKey);
      setRevealedSourceKey(sourceKey);
    };
    const revealInTransition = () =>
      new Promise<void>((resolve) => {
        queueMicrotask(() => {
          if (!active) {
            resolve();
            return;
          }
          flushSync(() => {
            setPaintedKey(assetKey);
            setRevealedSourceKey(sourceKey);
          });
          resolve();
        });
      });

    if (!transitionName?.trim() || revealedSourceKey === sourceKey) {
      reveal();
      return () => {
        active = false;
        if (revealStartedRef.current === assetKey) {
          revealStartedRef.current = null;
        }
      };
    }

    startViewerModeTransition(viewerRef.current, revealInTransition).catch(
      () => {
        if (!active) return;
        revealStartedRef.current = null;
        flushSync(() => {
          setPaintedKey(assetKey);
          setRevealedSourceKey(sourceKey);
        });
      },
    );

    return () => {
      active = false;
      if (revealStartedRef.current === assetKey) {
        revealStartedRef.current = null;
      }
    };
  }, [
    assetKey,
    assetReady,
    effectiveOpen,
    painted,
    revealedSourceKey,
    sourceKey,
    transitionName,
    transitionReady,
  ]);

  useEffect(() => {
    const element = viewerElement;
    const ownerDocument = element?.ownerDocument;
    if (!effectiveOpen || !element || !ownerDocument) {
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
  }, [effectiveOpen, viewerElement]);

  const isPdfCanvas = contentMediaType === 'pdf' && !pdfFallback;
  const isRotated = contentRotation % 180 !== 0;
  const boxWidth =
    (isRotated ? mediaSize.height : mediaSize.width) * contentZoom;
  const boxHeight =
    (isRotated ? mediaSize.width : mediaSize.height) * contentZoom;
  const mediaBoxStyle = { height: boxHeight, width: boxWidth };
  const mediaContentStyle = {
    height: mediaSize.height,
    transform: `translate(-50%, -50%) rotate(${contentRotation}deg) scale(${contentZoom})`,
    transformOrigin: 'center',
    width: mediaSize.width,
  };
  const filename = contentDownloadName?.trim() || contentTitle;
  const showFrame = contentMediaType === 'document' || pdfFallback;

  const getStageContentSize = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return null;

    const bounds = stage.getBoundingClientRect();
    const style = stage.ownerDocument.defaultView?.getComputedStyle(stage);
    const padding = (value: string) => Number.parseFloat(value) || 0;

    return {
      height: Math.max(
        0,
        bounds.height -
          padding(style?.paddingTop ?? '') -
          padding(style?.paddingBottom ?? ''),
      ),
      width: Math.max(
        0,
        bounds.width -
          padding(style?.paddingLeft ?? '') -
          padding(style?.paddingRight ?? ''),
      ),
    };
  }, []);

  const fitImageToStage = useCallback(
    (image: HTMLImageElement) => {
      const bounds = getStageContentSize();
      const naturalWidth = image.naturalWidth || 1;
      const naturalHeight = image.naturalHeight || 1;
      const isImageRotated = contentRotation % 180 !== 0;
      const maxWidth =
        (isImageRotated ? bounds?.height : bounds?.width) || naturalWidth;
      const maxHeight =
        (isImageRotated ? bounds?.width : bounds?.height) || naturalHeight;
      const fit = Math.min(
        1,
        maxWidth / naturalWidth,
        maxHeight / naturalHeight,
      );

      setMediaSizeState({
        height: naturalHeight * fit,
        key: contentAssetKey,
        width: naturalWidth * fit,
      });
    },
    [contentAssetKey, contentRotation, getStageContentSize],
  );

  const fitFrameToStage = useCallback(() => {
    const bounds = getStageContentSize();
    const isFrameRotated = contentRotation % 180 !== 0;
    setMediaSizeState({
      height: (isFrameRotated ? bounds?.width : bounds?.height) || 720,
      key: contentAssetKey,
      width: (isFrameRotated ? bounds?.height : bounds?.width) || 1024,
    });
  }, [contentAssetKey, contentRotation, getStageContentSize]);

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (
      !effectiveOpen ||
      !stage ||
      (!image && !showFrame) ||
      typeof ResizeObserver === 'undefined'
    ) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (image) {
        if (image.complete && image.naturalWidth > 0) fitImageToStage(image);
      } else {
        fitFrameToStage();
      }
    });
    resizeObserver.observe(stage);

    if (image?.complete && image.naturalWidth > 0) fitImageToStage(image);
    else if (!image && showFrame) fitFrameToStage();

    return () => resizeObserver.disconnect();
  }, [
    assetKey,
    contentRotation,
    effectiveOpen,
    mediaType,
    pdfFallback,
    fitFrameToStage,
    fitImageToStage,
    showFrame,
    src,
  ]);

  const renderMediaContent = () => {
    if (contentMediaType === 'image') {
      return (
        <img
          alt={contentTitle}
          className={variants.base.viewerImage}
          key={contentAssetKey ?? undefined}
          onError={() =>
            setAssetState({ failed: true, key: contentAssetKey, ready: true })
          }
          onLoad={(event) => {
            fitImageToStage(event.currentTarget);
            setAssetState({ failed: false, key: contentAssetKey, ready: true });
          }}
          ref={imageRef}
          src={contentSrc}
          style={{ height: mediaSize.height, width: mediaSize.width }}
        />
      );
    }

    if (isPdfCanvas && pdfSession) {
      return (
        <div
          className={variants.base.pdfPage}
          key={contentAssetKey ?? undefined}
        >
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
          key={contentAssetKey ?? undefined}
          onLoad={() => {
            fitFrameToStage();
            setAssetState({ failed: false, key: contentAssetKey, ready: true });
          }}
          src={contentSrc}
          title={contentTitle}
        />
      );
    }

    return null;
  };

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Keyboard users need to focus this scroll region. */
  return (
    <OverlaySurface
      closingTransition={closingTransition}
      fullScreen
      kind="dialog"
      onOpenChange={changeOpen}
      open={open}
      showHeader={false}
      title={contentTitle}
      viewerSurface
    >
      <DocumentViewerPanel name={participantName} onRoot={setViewerRef}>
        <div className={variants.base.toolbar}>
          <span className={variants.base.toolbarTitle} title={filename}>
            {filename}
          </span>
          <div className={variants.base.toolbarSection}>
            <span lang={getMessageLocale('documentViewerZoomOut')}>
              <Button
                aria-label={messages.documentViewerZoomOut}
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
                −
              </Button>
            </span>
            <span lang={getMessageLocale('documentViewerZoomIn')}>
              <Button
                aria-label={messages.documentViewerZoomIn}
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
                +
              </Button>
            </span>
            <span lang={getMessageLocale('documentViewerRotateLabel')}>
              <span
                className="breeze:sr-only"
                id={rotateAccessibleLabelId}
                lang={getMessageLocale('documentViewerRotate')}
              >
                {messages.documentViewerRotate}
              </span>
              <Button
                aria-labelledby={rotateAccessibleLabelId}
                onAction={() =>
                  setRotationState({
                    key: sourceKey,
                    value: (rotation + 90) % 360,
                  })
                }
                size="sm"
                variant="secondary"
              >
                {messages.documentViewerRotateLabel}
              </Button>
            </span>
            <a
              className={variants.base.toolbarLink}
              download={filename}
              href={contentSrc}
              lang={getMessageLocale('documentViewerDownload')}
            >
              {messages.documentViewerDownload}
            </a>
            {fullscreenAvailable ? (
              <span
                lang={getMessageLocale(
                  isFullscreen
                    ? 'documentViewerExitFullScreen'
                    : 'documentViewerFullScreen',
                )}
              >
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
                  variant="secondary"
                >
                  {isFullscreen
                    ? messages.documentViewerExitFullScreen
                    : messages.documentViewerFullScreen}
                </Button>
              </span>
            ) : null}
            {onReplace ? (
              <span lang={getMessageLocale('documentViewerReplace')}>
                <Button onAction={onReplace} size="sm" variant="secondary">
                  {messages.documentViewerReplace}
                </Button>
              </span>
            ) : null}
            {onRemove ? (
              <span lang={getMessageLocale('documentViewerRemove')}>
                <Button onAction={onRemove} size="sm" variant="secondary">
                  {messages.documentViewerRemove}
                </Button>
              </span>
            ) : null}
            <span lang={getMessageLocale('close')}>
              <Button
                onAction={() => changeOpen(false)}
                size="sm"
                variant="secondary"
              >
                {messages.close}
              </Button>
            </span>
          </div>
        </div>
        {isPdfCanvas && pageCount > 1 ? (
          <div className={variants.base.pageToolbar}>
            <span lang={getMessageLocale('documentViewerPreviousPage')}>
              <Button
                disabled={contentPageNumber <= 1}
                onAction={() =>
                  setPageState({ key: sourceKey, value: pageNumber - 1 })
                }
                size="sm"
                variant="secondary"
              >
                {messages.documentViewerPreviousPage}
              </Button>
            </span>
            <span
              aria-live="polite"
              className={variants.base.pageStatus}
              lang={getMessageLocale('documentViewerPage')}
            >
              {messages.documentViewerPage
                .replace('{current}', String(contentPageNumber))
                .replace('{total}', String(pageCount))}
            </span>
            <span lang={getMessageLocale('documentViewerNextPage')}>
              <Button
                disabled={contentPageNumber >= pageCount}
                onAction={() =>
                  setPageState({ key: sourceKey, value: pageNumber + 1 })
                }
                size="sm"
                variant="secondary"
              >
                {messages.documentViewerNextPage}
              </Button>
            </span>
          </div>
        ) : null}
        <div className={variants.base.viewer}>
          <div
            aria-busy={!painted}
            aria-label={contentTitle}
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
                <span
                  className="breeze:block breeze:block-size-full breeze:inline-size-full"
                  lang={getMessageLocale('documentViewerLoading')}
                >
                  <Skeleton
                    blockSize="100%"
                    inlineSize="100%"
                    label={messages.documentViewerLoading}
                    shape="rectangle"
                  />
                </span>
              </div>
            ) : null}
          </div>
        </div>
        <p
          className={variants.base.viewerNotice}
          lang={getMessageLocale('documentViewerAccessibility')}
        >
          {messages.documentViewerAccessibility}
        </p>
        {assetFailed ? (
          <p
            aria-live="polite"
            className={variants.base.viewerNotice}
            lang={getMessageLocale('documentViewerImageUnavailable')}
          >
            {messages.documentViewerImageUnavailable}
          </p>
        ) : null}
        {pdfFallback ? (
          <p
            aria-live="polite"
            className={variants.base.viewerNotice}
            lang={getMessageLocale('documentViewerFallback')}
          >
            {messages.documentViewerFallback}
          </p>
        ) : null}
      </DocumentViewerPanel>
    </OverlaySurface>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
}
