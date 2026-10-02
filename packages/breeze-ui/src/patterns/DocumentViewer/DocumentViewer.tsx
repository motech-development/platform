import {
  type CSSProperties,
  type Dispatch,
  type MouseEvent,
  type ReactNode,
  type SetStateAction,
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
      'breeze:min-inline-[6rem] breeze:text-center breeze:text-breeze-sm breeze:tabular-nums breeze:text-breeze-ink-2',
    pageToolbar:
      'breeze:flex breeze:items-center breeze:justify-center breeze:gap-breeze-2 breeze:border-breeze-line breeze:border-be breeze:bg-breeze-canvas breeze:px-breeze-3 breeze:py-breeze-2',
    pdfPage:
      'breeze-pdf-page breeze:relative breeze:overflow-hidden breeze:bg-breeze-surface breeze:shadow-breeze-overlay',
    root: 'breeze:flex breeze:block-full breeze:inline-full breeze:min-block-0 breeze:min-inline-0 breeze:flex-col breeze:bg-breeze-canvas',
    skeletonLayer:
      'breeze:absolute breeze:inset-[0] breeze:flex breeze:items-center breeze:justify-center',
    stage:
      'breeze-document-viewer-stage breeze:relative breeze:flex breeze:min-block-0 breeze:min-inline-0 breeze:flex-1 breeze:overflow-auto breeze:rounded-breeze-sm breeze:bg-breeze-sunken breeze:p-breeze-4',
    stageContent:
      'breeze-document-viewer-stage-content breeze:flex breeze:min-block-full breeze:min-inline-full',
    textLayer: 'breeze-pdf-text-layer',
    toolbar:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px] breeze:border-breeze-line breeze:border-be breeze:bg-breeze-raised breeze:px-breeze-3 breeze:py-breeze-2',
    toolbarLink:
      'breeze:inline-flex breeze:min-block-breeze-sm breeze:items-center breeze:justify-center breeze:rounded-breeze-ctl breeze:border breeze:border-solid breeze:border-breeze-line-strong breeze:bg-breeze-surface breeze:px-breeze-3 breeze:text-breeze-sm breeze:leading-breeze-snug breeze:text-breeze-ink breeze:no-underline breeze:hover:bg-breeze-sunken breeze:focus-visible:outline-2 breeze:focus-visible:outline-solid breeze:focus-visible:outline-breeze-brand breeze:any-pointer-coarse:min-block-breeze-tap breeze:any-pointer-coarse:min-inline-breeze-tap',
    toolbarSection:
      'breeze:flex breeze:flex-wrap breeze:items-center breeze:gap-[6px]',
    toolbarTitle:
      'breeze:grow breeze:min-inline-0 breeze:overflow-hidden breeze:text-ellipsis breeze:whitespace-nowrap breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink-2 breeze:max-breeze-md:basis-full breeze:max-breeze-md:grow-0 breeze:max-breeze-md:shrink-0',
    viewer:
      'breeze:relative breeze:flex breeze:min-block-0 breeze:min-inline-0 breeze:flex-1 breeze:flex-col breeze:overflow-hidden',
    viewerFrame:
      'breeze:block breeze:block-full breeze:min-block-0 breeze:inline-full breeze:border-0 breeze:bg-breeze-surface',
    viewerImage: 'breeze:block breeze:object-contain',
    viewerNotice:
      'breeze:m-0 breeze:text-breeze-xs breeze:leading-breeze-snug breeze:text-breeze-ink-3',
    zoomStatus:
      'breeze:min-inline-[3rem] breeze:text-center breeze:text-breeze-xs breeze:tabular-nums breeze:text-breeze-ink-2',
  },
  compound: {},
  size: {},
  state: {
    painted: {
      hidden: 'breeze:invisible breeze:absolute breeze:inset-[0]',
      visible: 'breeze:visible',
    },
  },
  variant: {},
} as const;

/** The content kind used to select the image, PDF or native frame renderer. */
export type DocumentViewerMediaType = 'document' | 'image' | 'pdf';

/** Optional PDF.js worker URL and auxiliary asset directories for PDF files. */
export interface DocumentViewerPdfAssets {
  readonly cMapUrl?: string;
  readonly standardFontDataUrl?: string;
  /** URL emitted and hosted by the application for its installed PDF.js worker. */
  readonly workerSrc?: string;
}

interface DocumentViewerBaseProps {
  /** Name used for the download and the labelled viewer dialog. */
  downloadName?: string;
  /** Current open state controlled by the owning application. */
  open: boolean;
  /** Reports state changes requested by the viewer's actions. */
  onOpenChange: (open: boolean) => void;
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

type DocumentViewerMediaProps =
  | {
      mediaType: 'document' | 'image';
      pdfAssets?: never;
    }
  | {
      mediaType: 'pdf';
      /** Optional worker and auxiliary assets used to render the PDF. */
      pdfAssets?: DocumentViewerPdfAssets;
    };

/** Props for an attachment preview dialog with built-in reading controls. */
export type DocumentViewerProps = DocumentViewerBaseProps &
  DocumentViewerMediaProps;

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

/** Blob download keeps the filename and never navigates to an expired presigned URL. */
async function downloadDocument(
  event: MouseEvent<HTMLAnchorElement>,
  sourceUrl: string,
  filename: string,
): Promise<void> {
  const { ownerDocument } = event.currentTarget;
  const view = ownerDocument.defaultView;
  const source = new URL(sourceUrl, ownerDocument.baseURI);

  if (
    !view ||
    (source.protocol !== 'http:' && source.protocol !== 'https:') ||
    source.origin === view.location.origin
  ) {
    return;
  }

  event.preventDefault();

  const response = await fetch(source.href, { credentials: 'same-origin' });
  if (!response.ok) throw new Error('The attachment download failed.');

  const objectUrl = view.URL.createObjectURL(await response.blob());
  const downloadLink = ownerDocument.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = objectUrl;
  downloadLink.hidden = true;
  ownerDocument.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  view.setTimeout(() => view.URL.revokeObjectURL(objectUrl), 1000);
}

interface ViewerModeMarker {
  count: number;
  previous: string | null;
}

const viewerModeMarkers = new WeakMap<HTMLElement, ViewerModeMarker>();

async function startViewerModeTransition(
  element: HTMLElement | null,
  update: () => Promise<void>,
): Promise<void> {
  const dataset = element?.dataset;
  if (element) {
    const marker = viewerModeMarkers.get(element);
    if (marker) marker.count += 1;
    else {
      viewerModeMarkers.set(element, {
        count: 1,
        previous: dataset?.breezeViewerModeTransition ?? null,
      });
    }
    if (dataset) dataset.breezeViewerModeTransition = '';
  }
  const restoreMarker = () => {
    if (!dataset) return;
    const marker = viewerModeMarkers.get(element);
    if (!marker) return;
    marker.count -= 1;
    if (marker.count > 0) return;
    viewerModeMarkers.delete(element);
    if (marker.previous === null) delete dataset.breezeViewerModeTransition;
    else dataset.breezeViewerModeTransition = marker.previous;
  };

  try {
    await startViewTransitionAndWait(update, ['mode']);
  } finally {
    restoreMarker();
  }
}

function waitForNextMicrotask(): Promise<void> {
  return new Promise((resolve) => {
    queueMicrotask(() => resolve());
  });
}

function useDocumentSourceKey(
  effectiveOpen: boolean,
  reactId: string,
  mediaType: DocumentViewerMediaType,
  src: string,
  pdfAssetOptions?: DocumentViewerPdfAssets,
) {
  const sourceSignature = effectiveOpen
    ? JSON.stringify([
        mediaType,
        src,
        pdfAssetOptions?.cMapUrl ?? null,
        pdfAssetOptions?.standardFontDataUrl ?? null,
        pdfAssetOptions?.workerSrc ?? null,
      ])
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

  if (!effectiveOpen || sourceLifecycle.signature !== sourceSignature) {
    return null;
  }

  return `${reactId}:${sourceLifecycle.generation}`;
}

function areSameViewerState(
  previous: ExitingViewerState | null,
  current: ExitingViewerState,
) {
  return Boolean(
    previous?.assetKey === current.assetKey &&
      previous.downloadName === current.downloadName &&
      previous.mediaType === current.mediaType &&
      previous.pageNumber === current.pageNumber &&
      previous.rotation === current.rotation &&
      previous.sourceKey === current.sourceKey &&
      previous.src === current.src &&
      previous.title === current.title &&
      previous.zoom === current.zoom,
  );
}

interface CurrentViewerProps {
  assetKey: string | null;
  downloadName?: string;
  mediaType: DocumentViewerMediaType;
  pageNumber: number;
  rotation: number;
  sourceKey: string | null;
  src: string;
  title: string;
  zoom: number;
}

function getDisplayedViewerState(
  effectiveOpen: boolean,
  current: ExitingViewerState | null,
  retained: ExitingViewerState | null,
  fallback: CurrentViewerProps,
): ExitingViewerState | CurrentViewerProps {
  if (effectiveOpen && current) return current;
  if (!effectiveOpen && retained) return retained;

  return {
    assetKey: fallback.assetKey,
    downloadName: fallback.downloadName,
    mediaType: fallback.mediaType,
    pageNumber: fallback.pageNumber,
    rotation: fallback.rotation,
    sourceKey: fallback.sourceKey,
    src: fallback.src,
    title: fallback.title,
    zoom: fallback.zoom,
  };
}

interface UseViewerOpenChangeOptions {
  currentViewerState: ExitingViewerState | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  parentOverlayOpen?: boolean;
  setClosingTransition: (closing: boolean) => void;
  setExitState: Dispatch<SetStateAction<ExitingViewerState | null>>;
  transitionName?: string;
}

function useViewerOpenChange({
  currentViewerState,
  onOpenChange,
  open,
  parentOverlayOpen,
  setClosingTransition,
  setExitState,
  transitionName,
}: UseViewerOpenChangeOptions) {
  return useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setClosingTransition(false);
        setExitState(null);
        onOpenChange(true);
        return;
      }

      if (!open || !transitionName?.trim() || parentOverlayOpen === false) {
        setClosingTransition(false);
        if (currentViewerState) setExitState(currentViewerState);
        onOpenChange(false);
        return;
      }

      let closed = false;
      let callbackFailed = false;
      const closeInTransition = () => {
        if (closed) return;
        closed = true;
        try {
          flushSync(() => {
            setClosingTransition(true);
            if (currentViewerState) setExitState(currentViewerState);
            onOpenChange(false);
          });
        } catch (error) {
          callbackFailed = true;
          throw error;
        }
      };

      startViewTransitionAndWait(closeInTransition, ['expand']).catch(
        (error: unknown) => {
          if (callbackFailed) throw error;
          closeInTransition();
        },
      );
    },
    [
      currentViewerState,
      onOpenChange,
      open,
      parentOverlayOpen,
      setClosingTransition,
      setExitState,
      transitionName,
    ],
  );
}

function getMediaGeometry(
  mediaSize: KeyedSize,
  rotation: number,
  zoom: number,
) {
  const isRotated = rotation % 180 !== 0;
  const width = isRotated ? mediaSize.height : mediaSize.width;
  const height = isRotated ? mediaSize.width : mediaSize.height;

  return {
    mediaBoxStyle: { height: height * zoom, width: width * zoom },
    mediaContentStyle: {
      height: mediaSize.height,
      transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${zoom})`,
      transformOrigin: 'center',
      width: mediaSize.width,
    },
  };
}

function useRetainedViewerState(
  effectiveOpen: boolean,
  currentViewerState: ExitingViewerState | null,
  setClosingTransition: (closing: boolean) => void,
) {
  const [exitState, setExitState] = useState<ExitingViewerState | null>(null);
  const [lastViewerState, setLastViewerState] =
    useState<ExitingViewerState | null>(null);
  const activeViewerStateRef = useRef<ExitingViewerState | null>(null);

  useLayoutEffect(() => {
    if (effectiveOpen && currentViewerState) {
      setClosingTransition(false);
      activeViewerStateRef.current = currentViewerState;
      setLastViewerState((previous) =>
        areSameViewerState(previous, currentViewerState)
          ? previous
          : currentViewerState,
      );
      setExitState(null);
      return;
    }

    if (!activeViewerStateRef.current) return;
    setExitState((previous) => previous ?? activeViewerStateRef.current);
    activeViewerStateRef.current = null;
  }, [currentViewerState, effectiveOpen, setClosingTransition]);

  return { exitState, lastViewerState, setExitState };
}

function getStageContentSize(stage: HTMLElement | null) {
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
}

interface UseStageSizingOptions {
  assetKey: string | null;
  contentAssetKey: string | null;
  contentRotation: number;
  effectiveOpen: boolean;
  fitFrame: boolean;
  imageRef: { current: HTMLImageElement | null };
  setMediaSizeState: Dispatch<SetStateAction<KeyedSize>>;
  src: string;
  stageRef: { current: HTMLElement | null };
}

function useStageSizing({
  assetKey,
  contentAssetKey,
  contentRotation,
  effectiveOpen,
  fitFrame,
  imageRef,
  setMediaSizeState,
  src,
  stageRef,
}: UseStageSizingOptions) {
  const fitImageToStage = useCallback(
    (image: HTMLImageElement) => {
      const bounds = getStageContentSize(stageRef.current);
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
    [contentAssetKey, contentRotation, setMediaSizeState, stageRef],
  );

  const fitFrameToStage = useCallback(() => {
    const bounds = getStageContentSize(stageRef.current);
    const isFrameRotated = contentRotation % 180 !== 0;
    setMediaSizeState({
      height: (isFrameRotated ? bounds?.width : bounds?.height) || 720,
      key: contentAssetKey,
      width: (isFrameRotated ? bounds?.height : bounds?.width) || 1024,
    });
  }, [contentAssetKey, contentRotation, setMediaSizeState, stageRef]);

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (
      !effectiveOpen ||
      !stage ||
      (!image && !fitFrame) ||
      typeof ResizeObserver === 'undefined'
    ) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (image?.complete && image.naturalWidth > 0) fitImageToStage(image);
      else if (!image && fitFrame) fitFrameToStage();
    });
    resizeObserver.observe(stage);

    if (image?.complete && image.naturalWidth > 0) fitImageToStage(image);
    else if (!image && fitFrame) fitFrameToStage();

    return () => resizeObserver.disconnect();
  }, [
    assetKey,
    contentRotation,
    effectiveOpen,
    fitFrame,
    fitFrameToStage,
    fitImageToStage,
    imageRef,
    src,
    stageRef,
  ]);

  return { fitFrameToStage, fitImageToStage };
}

interface UsePdfPreviewOptions {
  assetKey: string | null;
  canvasRef: { current: HTMLCanvasElement | null };
  contentMediaType: DocumentViewerMediaType;
  contentSourceKey: string | null;
  effectiveOpen: boolean;
  mediaType: DocumentViewerMediaType;
  pageNumber: number;
  pdfAssetOptions?: DocumentViewerPdfAssets;
  setAssetState: Dispatch<SetStateAction<KeyedAsset>>;
  setMediaSizeState: Dispatch<SetStateAction<KeyedSize>>;
  sourceKey: string | null;
  src: string;
  textLayerRef: { current: HTMLDivElement | null };
  zoom: number;
}

function usePdfPreview({
  assetKey,
  canvasRef,
  contentMediaType,
  contentSourceKey,
  effectiveOpen,
  mediaType,
  pageNumber,
  pdfAssetOptions,
  setAssetState,
  setMediaSizeState,
  sourceKey,
  src,
  textLayerRef,
  zoom,
}: UsePdfPreviewOptions) {
  const [sessionState, setSessionState] = useState<{
    key: string;
    session: PdfSession;
  } | null>(null);
  const [fallbackKey, setFallbackKey] = useState<string | null>(null);
  const renderQueueRef = useRef<Promise<void>>(Promise.resolve());
  const session =
    sessionState?.key === contentSourceKey ? sessionState.session : null;
  const fallback =
    contentSourceKey !== null &&
    fallbackKey === contentSourceKey &&
    contentMediaType === 'pdf';

  useEffect(() => {
    if (!effectiveOpen || !sourceKey || mediaType !== 'pdf') return undefined;

    let active = true;
    let loadedSession: PdfSession | null = null;
    const controller = new AbortController();

    loadPdfDocument(src, controller.signal, pdfAssetOptions)
      .then((nextSession) => {
        loadedSession = nextSession;
        if (!active || controller.signal.aborted) {
          nextSession.dispose();
          return;
        }

        setSessionState({ key: sourceKey, session: nextSession });
      })
      .catch(() => {
        if (!active || controller.signal.aborted) return;
        setFallbackKey(sourceKey);
      });

    return () => {
      active = false;
      controller.abort();
      loadedSession?.dispose();
    };
  }, [effectiveOpen, mediaType, pdfAssetOptions, sourceKey, src]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const textLayerContainer = textLayerRef.current;
    if (
      !effectiveOpen ||
      !sourceKey ||
      !assetKey ||
      mediaType !== 'pdf' ||
      fallback ||
      !session ||
      !canvas ||
      !textLayerContainer
    ) {
      return undefined;
    }

    const controller = new AbortController();
    const outputScale =
      zoom * (canvas.ownerDocument.defaultView?.devicePixelRatio || 1);
    // A ready page stays painted while the renderer prepares the new density.
    setAssetState((current) =>
      current.key === assetKey && current.ready && !current.failed
        ? current
        : { failed: false, key: assetKey, ready: false },
    );
    const previousRender = renderQueueRef.current;
    const render = previousRender.then(async () => {
      if (controller.signal.aborted) return;

      await renderPdfPage({
        TextLayer: session.textLayer,
        canvas,
        document: session.document,
        outputScale,
        pageNumber,
        rotation: 0,
        scale: 1,
        signal: controller.signal,
        textLayerContainer,
      });

      if (controller.signal.aborted) return;

      setMediaSizeState({
        height: Number.parseFloat(canvas.style.height) || 0,
        key: assetKey,
        width: Number.parseFloat(canvas.style.width) || 0,
      });
      setAssetState({ failed: false, key: assetKey, ready: true });
    });
    renderQueueRef.current = render.then(
      () => undefined,
      () => {
        if (controller.signal.aborted) return;
        setFallbackKey(sourceKey);
        setAssetState({ failed: false, key: assetKey, ready: false });
      },
    );

    return () => controller.abort();
  }, [
    assetKey,
    canvasRef,
    effectiveOpen,
    fallback,
    mediaType,
    pageNumber,
    session,
    setAssetState,
    setMediaSizeState,
    sourceKey,
    textLayerRef,
    zoom,
  ]);

  return {
    fallback,
    pageCount: session?.document.numPages ?? 0,
    session,
  };
}

interface UsePaintedAssetOptions {
  assetKey: string | null;
  assetReady: boolean;
  contentAssetKey: string | null;
  contentSourceKey: string | null;
  effectiveOpen: boolean;
  sourceKey: string | null;
  transitionName?: string;
  viewerRef: { current: HTMLElement | null };
}

function usePaintedAsset({
  assetKey,
  assetReady,
  contentAssetKey,
  contentSourceKey,
  effectiveOpen,
  sourceKey,
  transitionName,
  viewerRef,
}: UsePaintedAssetOptions) {
  const [transitionReadyKey, setTransitionReadyKey] = useState<string | null>(
    null,
  );
  const [paintedKey, setPaintedKey] = useState<string | null>(null);
  const [revealedSourceKey, setRevealedSourceKey] = useState<string | null>(
    null,
  );
  const revealStartedRef = useRef<string | null>(null);
  const transitionReady = transitionReadyKey === sourceKey && effectiveOpen;
  const painted =
    paintedKey === contentAssetKey && assetReady && contentSourceKey !== null;

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
    const revealInTransition = async () => {
      await waitForNextMicrotask();
      if (!active) return;
      flushSync(() => {
        setPaintedKey(assetKey);
        setRevealedSourceKey(sourceKey);
      });
    };
    const clearRevealMarker = () => {
      if (revealStartedRef.current === assetKey) {
        revealStartedRef.current = null;
      }
    };

    if (!transitionName?.trim() || revealedSourceKey === sourceKey) {
      reveal();
      return () => {
        active = false;
        clearRevealMarker();
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
      clearRevealMarker();
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
    viewerRef,
  ]);

  return painted;
}

function useFullscreenState(
  effectiveOpen: boolean,
  viewerElement: HTMLElement | null,
) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenAvailable =
    effectiveOpen &&
    typeof document !== 'undefined' &&
    document.fullscreenEnabled &&
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype.requestFullscreen === 'function';

  useEffect(() => {
    const ownerDocument = viewerElement?.ownerDocument;
    if (!effectiveOpen || !viewerElement || !ownerDocument) {
      setIsFullscreen(false);
      return undefined;
    }

    const target = getFullscreenTarget(viewerElement);
    const update = () => {
      setIsFullscreen(ownerDocument.fullscreenElement === target);
    };
    update();
    ownerDocument.addEventListener('fullscreenchange', update);
    return () => ownerDocument.removeEventListener('fullscreenchange', update);
  }, [effectiveOpen, viewerElement]);

  return { fullscreenAvailable, isFullscreen };
}

interface DocumentViewerPanelProps {
  children: ReactNode;
  name: string;
  participates: boolean;
  onRoot: (element: HTMLDivElement | null) => void;
}

function DocumentViewerPanel({
  children,
  name,
  participates,
  onRoot,
}: Readonly<DocumentViewerPanelProps>) {
  const transitionRef = useViewTransitionParticipant({
    name,
    types: ['expand', 'mode'],
  });
  const setRootRef = useCallback(
    (element: HTMLDivElement | null) => {
      const cleanup = participates ? transitionRef(element) : undefined;
      onRoot(element);

      if (!element) return cleanup;

      return () => {
        onRoot(null);
        cleanup?.();
      };
    },
    [onRoot, participates, transitionRef],
  );

  return (
    <div className={variants.base.root} ref={setRootRef}>
      {children}
    </div>
  );
}

interface DocumentViewerMediaRendererProps {
  assetKey: string | null;
  canvasRef: { current: HTMLCanvasElement | null };
  effectiveOpen: boolean;
  fitFrameToStage: () => void;
  fitImageToStage: (image: HTMLImageElement) => void;
  imageRef: { current: HTMLImageElement | null };
  isPdfCanvas: boolean;
  mediaSize: KeyedSize;
  mediaType: DocumentViewerMediaType;
  onAssetStateChange: (state: KeyedAsset) => void;
  pdfSession: PdfSession | null;
  src: string;
  textLayerRef: { current: HTMLDivElement | null };
  title: string;
}

interface NativePdfFallbackFrameProps {
  assetKey: string;
  effectiveOpen: boolean;
  fitFrameToStage: () => void;
  onAssetStateChange: (state: KeyedAsset) => void;
  src: string;
  title: string;
}

function NativePdfFallbackFrame({
  assetKey,
  effectiveOpen,
  fitFrameToStage,
  onAssetStateChange,
  src,
  title,
}: Readonly<NativePdfFallbackFrameProps>) {
  const [objectUrl, setObjectUrl] = useState<{
    key: string;
    url: string;
  } | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!effectiveOpen || objectUrl?.key === assetKey) return undefined;

    const controller = new AbortController();
    onAssetStateChange({ failed: false, key: assetKey, ready: false });

    fetch(src, {
      credentials: 'same-origin',
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('The PDF fallback request failed.');

        const sourceBlob = await response.blob();
        if (controller.signal.aborted) return;

        const pdfBlob = new Blob([sourceBlob], { type: 'application/pdf' });
        const nextObjectUrl = URL.createObjectURL(pdfBlob);
        if (controller.signal.aborted) {
          URL.revokeObjectURL(nextObjectUrl);
          return;
        }

        objectUrlRef.current = nextObjectUrl;
        setObjectUrl({ key: assetKey, url: nextObjectUrl });
      })
      .catch(() => {
        if (controller.signal.aborted) return;
        onAssetStateChange({ failed: true, key: assetKey, ready: true });
      });

    return () => controller.abort();
  }, [assetKey, effectiveOpen, objectUrl?.key, onAssetStateChange, src]);

  useEffect(
    () => () => {
      const currentObjectUrl = objectUrlRef.current;
      objectUrlRef.current = null;
      if (currentObjectUrl) URL.revokeObjectURL(currentObjectUrl);
    },
    [],
  );

  if (objectUrl?.key !== assetKey) return null;

  return (
    <iframe
      className={variants.base.viewerFrame}
      onError={() =>
        onAssetStateChange({ failed: true, key: assetKey, ready: true })
      }
      onLoad={() => {
        fitFrameToStage();
        onAssetStateChange({ failed: false, key: assetKey, ready: true });
      }}
      src={objectUrl.url}
      title={title}
    />
  );
}

function DocumentViewerMedia({
  assetKey,
  canvasRef,
  effectiveOpen,
  fitFrameToStage,
  fitImageToStage,
  imageRef,
  isPdfCanvas,
  mediaSize,
  mediaType,
  onAssetStateChange,
  pdfSession,
  src,
  textLayerRef,
  title,
}: Readonly<DocumentViewerMediaRendererProps>) {
  if (!assetKey) return null;

  if (mediaType === 'image') {
    return (
      <img
        alt={title}
        className={variants.base.viewerImage}
        key={assetKey}
        onError={() =>
          onAssetStateChange({ failed: true, key: assetKey, ready: true })
        }
        onLoad={(event) => {
          fitImageToStage(event.currentTarget);
          onAssetStateChange({ failed: false, key: assetKey, ready: true });
        }}
        ref={imageRef}
        src={src}
        style={{ height: mediaSize.height, width: mediaSize.width }}
      />
    );
  }

  if (isPdfCanvas && pdfSession) {
    return (
      <div className={variants.base.pdfPage} key={assetKey}>
        <canvas aria-label={title} ref={canvasRef} />
        <div className={variants.base.textLayer} ref={textLayerRef} />
      </div>
    );
  }

  if (mediaType === 'pdf' && !isPdfCanvas) {
    return (
      <NativePdfFallbackFrame
        assetKey={assetKey}
        effectiveOpen={effectiveOpen}
        fitFrameToStage={fitFrameToStage}
        key={assetKey}
        onAssetStateChange={onAssetStateChange}
        src={src}
        title={title}
      />
    );
  }

  if (mediaType === 'document') {
    return (
      <iframe
        className={variants.base.viewerFrame}
        key={assetKey}
        onLoad={() => {
          fitFrameToStage();
          onAssetStateChange({ failed: false, key: assetKey, ready: true });
        }}
        sandbox="allow-downloads"
        src={src}
        title={title}
      />
    );
  }

  return null;
}

interface DocumentViewerToolbarProps {
  downloadClick: (event: MouseEvent<HTMLAnchorElement>) => void;
  downloadName: string;
  downloadSrc: string;
  fullscreenAvailable: boolean;
  isFullscreen: boolean;
  onClose: () => void;
  onRemove?: () => void;
  onReplace?: () => void;
  onRotationChange: (rotation: number) => void;
  onZoomChange: (zoom: number) => void;
  rotateAccessibleLabelId: string;
  rotation: number;
  viewerRef: { current: HTMLDivElement | null };
  zoom: number;
}

function DocumentViewerToolbar({
  downloadClick,
  downloadName,
  downloadSrc,
  fullscreenAvailable,
  isFullscreen,
  onClose,
  onRemove,
  onReplace,
  onRotationChange,
  onZoomChange,
  rotateAccessibleLabelId,
  rotation,
  viewerRef,
  zoom,
}: Readonly<DocumentViewerToolbarProps>) {
  const { getMessageLocale, messages } = useBreezeContext();
  const zoomLocale = getMessageLocale('documentViewerZoom');
  const zoomPercentage = new Intl.NumberFormat(zoomLocale, {
    maximumFractionDigits: 0,
    style: 'percent',
  }).format(zoom);

  return (
    <div className={variants.base.toolbar}>
      <span className={variants.base.toolbarTitle} title={downloadName}>
        {downloadName}
      </span>
      <div className={variants.base.toolbarSection}>
        <span
          aria-live="polite"
          className={variants.base.zoomStatus}
          lang={zoomLocale}
          role="status"
        >
          {messages.documentViewerZoom.replace('{zoom}', zoomPercentage)}
        </span>
        <span lang={getMessageLocale('documentViewerZoomOut')}>
          <Button
            aria-label={messages.documentViewerZoomOut}
            disabled={zoom <= 0.5}
            onAction={() => onZoomChange(Math.max(0.5, zoom - 0.25))}
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
            onAction={() => onZoomChange(Math.min(3, zoom + 0.25))}
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
            onAction={() => onRotationChange((rotation + 90) % 360)}
            size="sm"
            variant="secondary"
          >
            {messages.documentViewerRotateLabel}
          </Button>
        </span>
        <a
          className={variants.base.toolbarLink}
          download={downloadName}
          href={downloadSrc}
          lang={getMessageLocale('documentViewerDownload')}
          onClick={downloadClick}
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
                const request =
                  ownerDocument.fullscreenElement === target
                    ? ownerDocument.exitFullscreen?.()
                    : target.requestFullscreen?.();
                request?.catch(() => undefined);
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
          <Button onAction={onClose} size="sm" variant="secondary">
            {messages.close}
          </Button>
        </span>
      </div>
    </div>
  );
}

interface DocumentViewerViewportProps {
  assetFailed: boolean;
  assetKey: string | null;
  canvasRef: { current: HTMLCanvasElement | null };
  downloadFailed: boolean;
  effectiveOpen: boolean;
  fitFrameToStage: () => void;
  fitImageToStage: (image: HTMLImageElement) => void;
  imageRef: { current: HTMLImageElement | null };
  isPdfCanvas: boolean;
  mediaBoxStyle: CSSProperties;
  mediaContentStyle: CSSProperties;
  mediaSize: KeyedSize;
  mediaType: DocumentViewerMediaType;
  onAssetStateChange: (state: KeyedAsset) => void;
  painted: boolean;
  pdfFallback: boolean;
  pdfSession: PdfSession | null;
  setStageRef: (element: HTMLElement | null) => void;
  src: string;
  textLayerRef: { current: HTMLDivElement | null };
  title: string;
}

function DocumentViewerViewport({
  assetFailed,
  assetKey,
  canvasRef,
  downloadFailed,
  effectiveOpen,
  fitFrameToStage,
  fitImageToStage,
  imageRef,
  isPdfCanvas,
  mediaBoxStyle,
  mediaContentStyle,
  mediaSize,
  mediaType,
  onAssetStateChange,
  painted,
  pdfFallback,
  pdfSession,
  setStageRef,
  src,
  textLayerRef,
  title,
}: Readonly<DocumentViewerViewportProps>) {
  const { getMessageLocale, messages } = useBreezeContext();

  /* eslint-disable jsx-a11y/no-noninteractive-tabindex -- Keyboard users need to focus this scroll region. */
  return (
    <>
      <div className={variants.base.viewer}>
        <section
          aria-busy={!painted}
          aria-label={title}
          className={variants.base.stage}
          ref={setStageRef}
          tabIndex={0}
        >
          <div
            className={[
              variants.base.stageContent,
              variants.state.painted[painted ? 'visible' : 'hidden'],
            ].join(' ')}
            inert={!painted}
          >
            <div className={variants.base.mediaBox} style={mediaBoxStyle}>
              <div
                className={variants.base.mediaContent}
                style={mediaContentStyle}
              >
                <DocumentViewerMedia
                  assetKey={assetKey}
                  canvasRef={canvasRef}
                  effectiveOpen={effectiveOpen}
                  fitFrameToStage={fitFrameToStage}
                  fitImageToStage={fitImageToStage}
                  imageRef={imageRef}
                  isPdfCanvas={isPdfCanvas}
                  mediaSize={mediaSize}
                  mediaType={mediaType}
                  onAssetStateChange={onAssetStateChange}
                  pdfSession={pdfSession}
                  src={src}
                  textLayerRef={textLayerRef}
                  title={title}
                />
              </div>
            </div>
          </div>
          {!painted ? (
            <div className={variants.base.skeletonLayer}>
              <span
                className="breeze:block breeze:block-full breeze:inline-full"
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
        </section>
      </div>
      <p
        className={variants.base.viewerNotice}
        lang={getMessageLocale('documentViewerAccessibility')}
      >
        {messages.documentViewerAccessibility}
      </p>
      {assetFailed && mediaType === 'image' ? (
        <p
          aria-live="polite"
          className={variants.base.viewerNotice}
          lang={getMessageLocale('documentViewerImageUnavailable')}
        >
          {messages.documentViewerImageUnavailable}
        </p>
      ) : null}
      {pdfFallback && assetFailed ? (
        <p
          aria-live="polite"
          className={variants.base.viewerNotice}
          lang={getMessageLocale('documentViewerFallback')}
        >
          {messages.documentViewerFallback}
        </p>
      ) : null}
      {downloadFailed ? (
        <p
          className={variants.base.viewerNotice}
          lang={getMessageLocale('documentViewerDownloadFailed')}
          role="alert"
        >
          {messages.documentViewerDownloadFailed}
        </p>
      ) : null}
    </>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-tabindex */
}

interface DocumentViewerPageToolbarProps {
  currentPage: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  pageCount: number;
}

function DocumentViewerPageToolbar({
  currentPage,
  onNextPage,
  onPreviousPage,
  pageCount,
}: Readonly<DocumentViewerPageToolbarProps>) {
  const { getMessageLocale, messages } = useBreezeContext();

  return (
    <div className={variants.base.pageToolbar}>
      <span lang={getMessageLocale('documentViewerPreviousPage')}>
        <Button
          disabled={currentPage <= 1}
          onAction={onPreviousPage}
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
          .replace('{current}', String(currentPage))
          .replace('{total}', String(pageCount))}
      </span>
      <span lang={getMessageLocale('documentViewerNextPage')}>
        <Button
          disabled={currentPage >= pageCount}
          onAction={onNextPage}
          size="sm"
          variant="secondary"
        >
          {messages.documentViewerNextPage}
        </Button>
      </span>
    </div>
  );
}

/**
 * Opens an image or document in a full-screen viewer with its own toolbar.
 *
 * @summary A non-modal full-screen attachment preview with lazy PDF rendering.
 */
export function DocumentViewer({
  downloadName,
  mediaType,
  onOpenChange,
  onRemove,
  onReplace,
  open,
  pdfAssets,
  src,
  title,
  transitionName,
}: Readonly<DocumentViewerProps>) {
  const reactId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const rotateAccessibleLabelId = `${reactId}-rotate-accessible-label`;
  const explicitTransitionName = transitionName?.trim();
  const participantName =
    explicitTransitionName || `breeze-document-${reactId}`;
  const parentOverlay = useContext(ParentOverlayContext);
  const viewerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const setStageRef = useCallback((element: HTMLElement | null) => {
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
  const [closingTransition, setClosingTransition] = useState(false);
  const effectiveOpen = open && parentOverlay?.open !== false;
  const pdfAssetOptions = useMemo(() => {
    if (mediaType !== 'pdf') return undefined;

    const cMapUrl = pdfAssets?.cMapUrl?.trim() || undefined;
    const standardFontDataUrl =
      pdfAssets?.standardFontDataUrl?.trim() || undefined;
    const workerSrc = pdfAssets?.workerSrc?.trim() || undefined;

    return cMapUrl || standardFontDataUrl || workerSrc
      ? { cMapUrl, standardFontDataUrl, workerSrc }
      : undefined;
  }, [
    mediaType,
    pdfAssets?.cMapUrl,
    pdfAssets?.standardFontDataUrl,
    pdfAssets?.workerSrc,
  ]);
  const sourceKey = useDocumentSourceKey(
    effectiveOpen,
    reactId,
    mediaType,
    src,
    pdfAssetOptions,
  );
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
  const { exitState, lastViewerState, setExitState } = useRetainedViewerState(
    effectiveOpen,
    currentViewerState,
    setClosingTransition,
  );
  const changeOpen = useViewerOpenChange({
    currentViewerState,
    onOpenChange,
    open,
    parentOverlayOpen: parentOverlay?.open,
    setClosingTransition,
    setExitState,
    transitionName,
  });
  const retainedViewerState = exitState ?? lastViewerState;
  const displayedViewer = getDisplayedViewerState(
    effectiveOpen,
    currentViewerState,
    retainedViewerState,
    {
      assetKey,
      downloadName,
      mediaType,
      pageNumber,
      rotation,
      sourceKey,
      src,
      title,
      zoom,
    },
  );
  const {
    assetKey: contentAssetKey,
    downloadName: contentDownloadName,
    mediaType: contentMediaType,
    pageNumber: contentPageNumber,
    rotation: contentRotation,
    sourceKey: contentSourceKey,
    src: contentSrc,
    title: contentTitle,
    zoom: contentZoom,
  } = displayedViewer;
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
  const painted = usePaintedAsset({
    assetKey,
    assetReady,
    contentAssetKey,
    contentSourceKey,
    effectiveOpen,
    sourceKey,
    transitionName,
    viewerRef,
  });
  const {
    fallback: pdfFallback,
    pageCount,
    session: pdfSession,
  } = usePdfPreview({
    assetKey,
    canvasRef,
    contentMediaType,
    contentSourceKey,
    effectiveOpen,
    mediaType,
    pageNumber,
    pdfAssetOptions,
    setAssetState,
    setMediaSizeState,
    sourceKey,
    src,
    textLayerRef,
    zoom,
  });
  const { fullscreenAvailable, isFullscreen } = useFullscreenState(
    effectiveOpen,
    viewerElement,
  );

  const isPdfCanvas = contentMediaType === 'pdf' && !pdfFallback;
  const { mediaBoxStyle, mediaContentStyle } = getMediaGeometry(
    mediaSize,
    contentRotation,
    contentZoom,
  );
  const filename = contentDownloadName?.trim() || contentTitle;
  const showFrame = contentMediaType === 'document' || pdfFallback;
  const { fitFrameToStage, fitImageToStage } = useStageSizing({
    assetKey,
    contentAssetKey,
    contentRotation,
    effectiveOpen,
    fitFrame: showFrame,
    imageRef,
    setMediaSizeState,
    src,
    stageRef,
  });
  const [failedDownloadKey, setFailedDownloadKey] = useState<string | null>(
    null,
  );
  const handleDownloadClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const downloadKey = contentSourceKey;
    setFailedDownloadKey(null);
    downloadDocument(event, contentSrc, filename).catch(() => {
      setFailedDownloadKey(downloadKey);
    });
  };

  return (
    <OverlaySurface
      closingTransition={closingTransition}
      kind="fullscreen"
      onOpenChange={changeOpen}
      open={open}
      showHeader={false}
      title={contentTitle}
      viewerSurface
    >
      <DocumentViewerPanel
        name={participantName}
        onRoot={setViewerRef}
        participates={Boolean(explicitTransitionName)}
      >
        <DocumentViewerToolbar
          downloadClick={handleDownloadClick}
          downloadName={filename}
          downloadSrc={contentSrc}
          fullscreenAvailable={fullscreenAvailable}
          isFullscreen={isFullscreen}
          onClose={() => changeOpen(false)}
          onRemove={onRemove}
          onReplace={onReplace}
          onRotationChange={(nextRotation) =>
            setRotationState({ key: sourceKey, value: nextRotation })
          }
          onZoomChange={(nextZoom) =>
            setZoomState({ key: sourceKey, value: nextZoom })
          }
          rotateAccessibleLabelId={rotateAccessibleLabelId}
          rotation={rotation}
          viewerRef={viewerRef}
          zoom={zoom}
        />
        {isPdfCanvas && pageCount > 1 ? (
          <DocumentViewerPageToolbar
            currentPage={contentPageNumber}
            onNextPage={() =>
              setPageState({ key: sourceKey, value: pageNumber + 1 })
            }
            onPreviousPage={() =>
              setPageState({ key: sourceKey, value: pageNumber - 1 })
            }
            pageCount={pageCount}
          />
        ) : null}
        <DocumentViewerViewport
          assetFailed={assetFailed}
          assetKey={contentAssetKey}
          canvasRef={canvasRef}
          downloadFailed={
            contentSourceKey !== null && failedDownloadKey === contentSourceKey
          }
          effectiveOpen={effectiveOpen}
          fitFrameToStage={fitFrameToStage}
          fitImageToStage={fitImageToStage}
          imageRef={imageRef}
          isPdfCanvas={isPdfCanvas}
          mediaBoxStyle={mediaBoxStyle}
          mediaContentStyle={mediaContentStyle}
          mediaSize={mediaSize}
          mediaType={contentMediaType}
          onAssetStateChange={setAssetState}
          painted={painted}
          pdfFallback={pdfFallback}
          pdfSession={pdfSession}
          setStageRef={setStageRef}
          src={contentSrc}
          textLayerRef={textLayerRef}
          title={contentTitle}
        />
      </DocumentViewerPanel>
    </OverlaySurface>
  );
}
