import type { CSSProperties, Key, ReactElement, ReactNode } from 'react';
import {
  Children,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { DialogTrigger as AriaDialogTrigger } from 'react-aria-components/Dialog';
import { CloseIcon } from '../../icons';
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
import { useBreezeContext } from '../../provider/BreezeContext';

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
    bottom: 'fixed inset-0 h-dvh w-full max-h-none max-w-none',
    end: 'fixed inset-y-0 end-0 h-dvh w-[min(var(--breeze-drawer-width),100vw)] max-h-none max-w-[var(--breeze-drawer-width)]',
    start:
      'fixed inset-y-0 start-0 h-dvh w-[min(var(--breeze-drawer-width),100vw)] max-h-none max-w-[var(--breeze-drawer-width)]',
  },
  lg: {
    bottom:
      'lg:fixed lg:inset-x-0 lg:bottom-0 lg:top-auto lg:h-dvh lg:w-full lg:max-w-none',
    end: 'lg:fixed lg:inset-y-0 lg:end-0 lg:start-auto lg:bottom-auto lg:h-dvh lg:w-[min(var(--breeze-drawer-width),100vw)] lg:max-h-none lg:max-w-[var(--breeze-drawer-width)]',
    start:
      'lg:fixed lg:inset-y-0 lg:start-0 lg:end-auto lg:bottom-auto lg:h-dvh lg:w-[min(var(--breeze-drawer-width),100vw)] lg:max-h-none lg:max-w-[var(--breeze-drawer-width)]',
  },
  md: {
    bottom:
      'md:fixed md:inset-x-0 md:bottom-0 md:top-auto md:h-dvh md:w-full md:max-w-none',
    end: 'md:fixed md:inset-y-0 md:end-0 md:start-auto md:bottom-auto md:h-dvh md:w-[min(var(--breeze-drawer-width),100vw)] md:max-h-none md:max-w-[var(--breeze-drawer-width)]',
    start:
      'md:fixed md:inset-y-0 md:start-0 md:end-auto md:bottom-auto md:h-dvh md:w-[min(var(--breeze-drawer-width),100vw)] md:max-h-none md:max-w-[var(--breeze-drawer-width)]',
  },
  sm: {
    bottom:
      'sm:fixed sm:inset-x-0 sm:bottom-0 sm:top-auto sm:h-dvh sm:w-full sm:max-w-none',
    end: 'sm:fixed sm:inset-y-0 sm:end-0 sm:start-auto sm:bottom-auto sm:h-dvh sm:w-[min(var(--breeze-drawer-width),100vw)] sm:max-h-none sm:max-w-[var(--breeze-drawer-width)]',
    start:
      'sm:fixed sm:inset-y-0 sm:start-0 sm:end-auto sm:bottom-auto sm:h-dvh sm:w-[min(var(--breeze-drawer-width),100vw)] sm:max-h-none sm:max-w-[var(--breeze-drawer-width)]',
  },
};

const drawerWidths: Record<DrawerSize, string> = {
  default: '36rem',
  medium: '38rem',
  wide: '48rem',
};
const adjacentDrawerWidth = '38rem';

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
export function Root(props: DrawerRootProps): ReactElement {
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
  scrollResetKey,
  size = 'default',
  ...props
}: DrawerContentProps): ReactElement {
  const { messages } = useBreezeContext();
  const modalState = useContext(DrawerModalStateContext);
  const bodyRef = useRef<HTMLDivElement>(null);
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
      surfaceClassName: `breeze-drawer-surface flex max-h-none flex-col overflow-clip border-0 p-0 shadow-xl ${adjacent === undefined ? '' : 'breeze-drawer-adjacent-surface'} ${resolveResponsiveClasses(placement, placementClasses)} ${resolveResponsiveClasses(placement, placementMotionClasses)}`,
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
