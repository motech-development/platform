import type { CSSProperties, Key, ReactElement, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components/Dialog';
import { CloseIcon } from '../../icons';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import {
  SharedModalContent,
  type SharedModalContentProps,
  SharedOverlayClose,
  type SharedOverlayCloseProps,
  SharedOverlayDescription,
  type SharedOverlayDescriptionProps,
  SharedOverlayTitle,
  type SharedOverlayTitleProps,
  SharedOverlayTrigger,
  type SharedOverlayTriggerProps,
} from '../../internal/react-aria/OverlayParts';
import {
  resolveResponsiveClasses,
  type ResponsiveValue,
} from '../../internal/styling/responsive';
import {
  type BreezeDirection,
  useBreezeContext,
} from '../../provider/BreezeContext';

/** Supported physical modes expressed with logical inline placement. */
export type DrawerPlacement = 'start' | 'end' | 'bottom';
/** Canonical inline drawer widths. Bottom drawers always remain full width. */
export type DrawerSize = 'default' | 'medium' | 'wide';
/** Desktop-only boundary used to layer a nested drawer beside existing content. */
export interface DrawerAdjacentLayer {
  /** Inline-end viewport space reserved for the existing layer, in CSS pixels. */
  inlineEndOffset: number;
}
const placementClasses = {
  base: {
    bottom:
      'fixed inset-y-0 start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] end-auto h-dvh w-[var(--breeze-drawer-visual-viewport-width,100vw)] max-h-none max-w-none',
    end: 'fixed inset-y-0 end-[var(--breeze-drawer-visual-viewport-offset-inline-end,0px)] h-dvh w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] max-h-none max-w-[var(--breeze-drawer-width)]',
    start:
      'fixed inset-y-0 start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] h-dvh w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] max-h-none max-w-[var(--breeze-drawer-width)]',
  },
  lg: {
    bottom:
      'lg:fixed lg:inset-y-0 lg:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] lg:end-auto lg:h-dvh lg:w-[var(--breeze-drawer-visual-viewport-width,100vw)] lg:max-w-none',
    end: 'lg:fixed lg:inset-y-0 lg:end-[var(--breeze-drawer-visual-viewport-offset-inline-end,0px)] lg:start-auto lg:h-dvh lg:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] lg:max-h-none lg:max-w-[var(--breeze-drawer-width)]',
    start:
      'lg:fixed lg:inset-y-0 lg:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] lg:end-auto lg:h-dvh lg:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] lg:max-h-none lg:max-w-[var(--breeze-drawer-width)]',
  },
  md: {
    bottom:
      'md:fixed md:inset-y-0 md:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] md:end-auto md:h-dvh md:w-[var(--breeze-drawer-visual-viewport-width,100vw)] md:max-w-none',
    end: 'md:fixed md:inset-y-0 md:end-[var(--breeze-drawer-visual-viewport-offset-inline-end,0px)] md:start-auto md:h-dvh md:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] md:max-h-none md:max-w-[var(--breeze-drawer-width)]',
    start:
      'md:fixed md:inset-y-0 md:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] md:end-auto md:h-dvh md:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] md:max-h-none md:max-w-[var(--breeze-drawer-width)]',
  },
  sm: {
    bottom:
      'sm:fixed sm:inset-y-0 sm:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] sm:end-auto sm:h-dvh sm:w-[var(--breeze-drawer-visual-viewport-width,100vw)] sm:max-w-none',
    end: 'sm:fixed sm:inset-y-0 sm:end-[var(--breeze-drawer-visual-viewport-offset-inline-end,0px)] sm:start-auto sm:h-dvh sm:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] sm:max-h-none sm:max-w-[var(--breeze-drawer-width)]',
    start:
      'sm:fixed sm:inset-y-0 sm:start-[var(--breeze-drawer-visual-viewport-offset-inline-start,0px)] sm:end-auto sm:h-dvh sm:w-[min(var(--breeze-drawer-width),var(--breeze-drawer-visual-viewport-width,100vw))] sm:max-h-none sm:max-w-[var(--breeze-drawer-width)]',
  },
};

const drawerWidths: Record<DrawerSize, string> = {
  default: '36rem',
  medium: '38rem',
  wide: '48rem',
};
const adjacentDrawerWidth = '38rem';
const visualViewportSurfaces = new Map<HTMLElement, BreezeDirection>();
let removeVisualViewportListeners: (() => void) | undefined;

function updateVisualViewportSurface(
  surface: HTMLElement,
  viewport: VisualViewport,
  direction: BreezeDirection,
): void {
  const offsetRight = Math.max(
    0,
    window.innerWidth - viewport.offsetLeft - viewport.width,
  );
  const offsetInlineStart =
    direction === 'rtl' ? offsetRight : viewport.offsetLeft;
  const offsetInlineEnd =
    direction === 'rtl' ? viewport.offsetLeft : offsetRight;

  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-height',
    `${viewport.height}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-width',
    `${viewport.width}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-offset-top',
    `${viewport.offsetTop}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-offset-left',
    `${viewport.offsetLeft}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-offset-right',
    `${offsetRight}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-offset-inline-start',
    `${offsetInlineStart}px`,
  );
  surface.style.setProperty(
    '--breeze-drawer-visual-viewport-offset-inline-end',
    `${offsetInlineEnd}px`,
  );
  surface
    .closest<HTMLElement>('.breeze-modal-overlay')
    ?.style.setProperty(
      '--breeze-drawer-visual-viewport-offset-inline-end',
      `${offsetInlineEnd}px`,
    );
}

function updateVisualViewportSurfaces(): void {
  const viewport = window.visualViewport ?? null;

  if (viewport === null) return;

  visualViewportSurfaces.forEach((direction, surface) => {
    updateVisualViewportSurface(surface, viewport, direction);
  });
}

function registerVisualViewportSurface(
  surface: HTMLElement,
  direction: BreezeDirection,
): () => void {
  const viewport = window.visualViewport ?? null;

  if (viewport === null) return () => undefined;

  visualViewportSurfaces.set(surface, direction);
  updateVisualViewportSurface(surface, viewport, direction);

  if (removeVisualViewportListeners === undefined) {
    viewport.addEventListener('resize', updateVisualViewportSurfaces);
    viewport.addEventListener('scroll', updateVisualViewportSurfaces);
    removeVisualViewportListeners = () => {
      viewport.removeEventListener('resize', updateVisualViewportSurfaces);
      viewport.removeEventListener('scroll', updateVisualViewportSurfaces);
    };
  }

  return () => {
    visualViewportSurfaces.delete(surface);

    if (visualViewportSurfaces.size === 0) {
      removeVisualViewportListeners?.();
      removeVisualViewportListeners = undefined;
    }
  };
}

interface DrawerModalState {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

const DrawerModalStateContext = createContext<DrawerModalState | undefined>(
  undefined,
);

const placementMotionClasses = {
  base: {
    bottom: 'breeze-drawer-offset-bottom',
    end: 'breeze-drawer-offset-end',
    start: 'breeze-drawer-offset-start',
  },
  lg: {
    bottom: 'breeze-drawer-offset-lg-bottom',
    end: 'breeze-drawer-offset-lg-end',
    start: 'breeze-drawer-offset-lg-start',
  },
  md: {
    bottom: 'breeze-drawer-offset-md-bottom',
    end: 'breeze-drawer-offset-md-end',
    start: 'breeze-drawer-offset-md-start',
  },
  sm: {
    bottom: 'breeze-drawer-offset-sm-bottom',
    end: 'breeze-drawer-offset-sm-end',
    start: 'breeze-drawer-offset-sm-start',
  },
};

interface DrawerRootSharedProps {
  /** Trigger and drawer content. */ children: ReactNode;
}
interface ControlledDrawerRootProps {
  /** Current open state. */ open: boolean;
  /** Called with the next open state. */ onOpenChange: (open: boolean) => void;
  defaultOpen?: never;
  readOnly?: false;
}
interface ReadOnlyDrawerRootProps {
  /** Current immutable open state. */ open: boolean;
  /** Marks controlled state immutable. */ readOnly: true;
  defaultOpen?: never;
  onOpenChange?: never;
}
interface UncontrolledDrawerRootProps {
  /** Initial open state. */ defaultOpen?: boolean;
  /** Called with the next open state. */ onOpenChange?: (
    open: boolean,
  ) => void;
  open?: never;
  readOnly?: false;
}
interface TriggeredDrawerRootProps extends DrawerRootSharedProps {
  /** Uses a compound trigger to coordinate drawer state. */
  triggerless?: false;
}
interface TriggerlessDrawerRootProps extends DrawerRootSharedProps {
  defaultOpen?: never;
  /** Called with the next externally controlled open state. */
  onOpenChange: (open: boolean) => void;
  /** Current externally controlled open state. */
  open: boolean;
  readOnly?: never;
  /** Omits a compound trigger for state controlled by an external action. */
  triggerless: true;
}
/** Props for controlled, read-only, or uncontrolled drawer state. */ export type DrawerRootProps =

    | (TriggeredDrawerRootProps &
        (
          | ControlledDrawerRootProps
          | ReadOnlyDrawerRootProps
          | UncontrolledDrawerRootProps
        ))
    | TriggerlessDrawerRootProps;
/** Props for the drawer trigger. */ export type DrawerTriggerProps =
  SharedOverlayTriggerProps;
/** Props for a responsive modal drawer surface. */ export interface DrawerContentProps
  extends Omit<
    SharedModalContentProps,
    | 'modalClassName'
    | 'modalState'
    | 'overlayClassName'
    | 'overlayStyle'
    | 'surfaceClassName'
  > {
  /** Clips and positions this layer beside reserved content on wide screens. */
  adjacent?: DrawerAdjacentLayer;
  /** Header treatment. `none` leaves all content unframed for application-owned shell drawers. Defaults to `default`. */
  chrome?: 'default' | 'none' | 'soft';
  /** Responsive logical edge. Defaults to `end`. */ placement?: ResponsiveValue<DrawerPlacement>;
  /** Resets the scrollable body to the start whenever this value changes. */ scrollResetKey?: Key;
  /** Canonical inline width. Bottom placement remains full width. Defaults to `default`. */
  size?: DrawerSize;
}
/** Props for the required drawer title. */ export type DrawerTitleProps =
  SharedOverlayTitleProps;
/** Props for the required drawer description. */ export type DrawerDescriptionProps =
  SharedOverlayDescriptionProps;
/** Props for a semantic drawer close action. */ export type DrawerCloseProps =
  SharedOverlayCloseProps;

/** Coordinates a modal panel that enters from a logical viewport edge. */
export function Root(props: Readonly<DrawerRootProps>): ReactElement {
  useBreezeContext();
  const { children, triggerless } = props;

  if (triggerless) {
    const { onOpenChange, open } = props;

    return createElement(
      DrawerModalStateContext.Provider,
      {
        value: {
          onOpenChange,
          open,
        },
      },
      children,
    );
  }

  const { defaultOpen, onOpenChange, open } = props;

  return createElement(
    DrawerModalStateContext.Provider,
    { value: undefined },
    <AriaDialogTrigger
      defaultOpen={defaultOpen}
      isOpen={open}
      onOpenChange={onOpenChange}
    >
      {children}
    </AriaDialogTrigger>,
  );
}
export function Content({
  adjacent,
  children,
  chrome = 'default',
  placement = 'end',
  ref,
  scrollResetKey,
  size = 'default',
  ...props
}: Readonly<DrawerContentProps>): ReactElement {
  const { direction, messages } = useBreezeContext();
  const modalState = useContext(DrawerModalStateContext);
  const bodyRef = useRef<HTMLDivElement>(null);
  const visualViewportCleanupRef = useRef<(() => void) | undefined>(undefined);
  const forwardedRef = useForwardedRef(ref);
  const surfaceRef = useCallback(
    (surface: HTMLElement | null) => {
      visualViewportCleanupRef.current?.();
      visualViewportCleanupRef.current =
        surface === null
          ? undefined
          : registerVisualViewportSurface(surface, direction);
      forwardedRef(surface);
    },
    [direction, forwardedRef],
  );
  const childElements = Children.toArray(children);
  const titleElement = childElements.find(
    (child): child is ReactElement<DrawerTitleProps> =>
      isValidElement<DrawerTitleProps>(child) &&
      child.type === SharedOverlayTitle,
  );
  const descriptionElement = childElements.find(
    (child): child is ReactElement<DrawerDescriptionProps> =>
      isValidElement<DrawerDescriptionProps>(child) &&
      child.type === SharedOverlayDescription,
  );
  const body = childElements.filter(
    (child) => child !== titleElement && child !== descriptionElement,
  );
  const headerTone =
    chrome === 'soft'
      ? 'bg-[var(--breeze-shell-soft)]'
      : 'bg-[var(--breeze-shell)]';
  const overlayStyle = {
    '--breeze-drawer-width':
      adjacent === undefined ? drawerWidths[size] : adjacentDrawerWidth,
    ...(adjacent === undefined
      ? {}
      : {
          '--breeze-drawer-adjacent-inline-end': `${adjacent.inlineEndOffset}px`,
        }),
  } as CSSProperties;

  useEffect(() => {
    if (bodyRef.current !== null) {
      bodyRef.current.scrollTop = 0;
    }
  }, [scrollResetKey]);

  const framedChildren = (
    <>
      <header
        className={`flex shrink-0 items-center justify-between gap-5 px-4 py-4 text-[var(--breeze-ink-inverse)] sm:px-6 sm:py-5 ${headerTone}`}
      >
        <div className="min-w-0">
          {descriptionElement === undefined
            ? null
            : cloneElement(descriptionElement, {
                className: `mb-0 text-[var(--breeze-ink-inverse-muted)] ${descriptionElement.props.className ?? ''}`,
              })}
          {titleElement === undefined
            ? null
            : cloneElement(titleElement, {
                className: `mt-1 mb-0 text-2xl leading-[1.2] text-[var(--breeze-ink-inverse)] ${titleElement.props.className ?? ''}`,
              })}
        </div>
        <SharedOverlayClose
          aria-label={messages.close}
          autoFocus
          appearance="ghost"
          className="size-11 min-h-0 shrink-0 border-0 p-0 text-[var(--breeze-ink-inverse)] data-[hovered]:bg-white/10"
          variant="light"
        >
          <CloseIcon size="1rem" />
        </SharedOverlayClose>
      </header>
      <div
        className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:p-6"
        ref={bodyRef}
      >
        {body}
      </div>
    </>
  );

  return createElement(
    SharedModalContent,
    {
      ...props,
      modalClassName: `breeze-drawer-motion ${adjacent === undefined ? '' : 'breeze-drawer-adjacent-motion'}`,
      modalState,
      overlayClassName: `items-stretch justify-stretch overflow-hidden p-0 sm:p-0 ${adjacent === undefined ? '' : 'breeze-drawer-adjacent-overlay'}`,
      overlayStyle,
      ref: surfaceRef,
      surfaceClassName: `breeze-drawer-surface breeze-drawer-visual-viewport flex max-h-none flex-col overflow-clip border-0 p-0 shadow-xl ${adjacent === undefined ? '' : 'breeze-drawer-adjacent-surface'} ${resolveResponsiveClasses(placement, placementClasses)} ${resolveResponsiveClasses(placement, placementMotionClasses)}`,
    } as SharedModalContentProps,
    chrome === 'none' ? children : framedChildren,
  );
}
/**
 * Presents a modal task surface from a logical viewport edge with responsive
 * placement, focus containment, and controlled or trigger-owned state.
 *
 * @summary responsive edge-mounted modal task surface
 */
export const Drawer = {
  /** Semantic action that closes the current drawer layer. */
  Close: SharedOverlayClose,
  /** Responsive modal drawer surface and focus scope. */
  Content,
  /** Required accessible drawer description. */
  Description: SharedOverlayDescription,
  /** Controlled, read-only, or uncontrolled open-state coordinator. */
  Root,
  /** Required accessible drawer title. */
  Title: SharedOverlayTitle,
  /** Semantic action that opens the drawer. */
  Trigger: SharedOverlayTrigger,
};
