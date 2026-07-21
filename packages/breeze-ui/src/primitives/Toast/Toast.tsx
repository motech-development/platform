import type {
  ComponentProps,
  ComponentPropsWithRef,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';
import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useId,
  useMemo,
} from 'react';
import type { QueuedToast } from 'react-aria-components/Toast';
import {
  Button as AriaButton,
  Text as AriaText,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
} from 'react-aria-components/Toast';
import { tv } from 'tailwind-variants';
import useForwardedRef from '../../internal/hooks/useForwardedRef';
import type { VisualVariant } from '../../internal/styling/visual';
import { useBreezeContext } from '../../provider/BreezeContext';

const DEFAULT_LIFETIME = 5000;

const toastSurface = tv({
  base: 'grid min-w-72 max-w-md grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-2 border border-s-4 px-4 py-3 text-sm shadow-lg outline-none forced-colors:border-[CanvasText] data-[focus-visible]:ring-2 data-[focus-visible]:ring-[var(--breeze-focus)]',
  defaultVariants: {
    variant: 'info',
  },
  variants: {
    variant: {
      danger:
        'border-[var(--breeze-danger)] bg-[var(--breeze-danger-soft)] text-[var(--breeze-ink)]',
      dark: 'border-[var(--breeze-shell)] bg-[var(--breeze-shell)] text-white',
      info: 'border-[var(--breeze-info)] bg-[var(--breeze-info-soft)] text-[var(--breeze-ink)]',
      light:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface)] text-[var(--breeze-ink)]',
      primary:
        'border-[var(--breeze-primary)] bg-[var(--breeze-primary-soft)] text-[var(--breeze-ink)]',
      secondary:
        'border-[var(--breeze-border-strong)] bg-[var(--breeze-surface-subtle)] text-[var(--breeze-ink)]',
      success:
        'border-[var(--breeze-success)] bg-[var(--breeze-success-soft)] text-[var(--breeze-ink)]',
      warning:
        'border-[var(--breeze-warning)] bg-[var(--breeze-warning-soft)] text-[var(--breeze-ink)]',
    },
  },
});
const toastRegion = tv({
  base: 'fixed inset-block-start-4 inset-inline-end-4 z-50 grid max-h-[calc(100dvh-2rem)] gap-3 overflow-auto outline-none',
});
const toastContent = tv({ base: 'contents' });
const toastCopy = tv({ base: 'grid min-w-0 gap-1' });
const toastTitle = tv({ base: 'font-semibold' });
const toastDescription = tv({ base: 'text-current/80' });
const toastAction = tv({
  base: 'inline-flex min-h-11 items-center justify-self-start font-semibold underline underline-offset-2 outline-none hover:no-underline focus-visible:ring-2 focus-visible:ring-current',
});
const toastClose = tv({
  base: 'col-start-2 row-start-1 grid size-11 place-items-center self-start rounded-sm text-xl leading-none outline-none hover:bg-black/10 focus-visible:ring-2 focus-visible:ring-current forced-colors:border forced-colors:border-[ButtonText]',
});

/** Application action shown within a toast. */
export interface ToastAction {
  /** Application-owned translated action label. */
  label: ReactNode;
  /** Called once when the action is activated. */
  onAction: () => void;
}

/** Content and lifecycle options for a queued toast. */
export interface ToastOptions {
  /** Optional action that dismisses the toast after activation. */
  action?: ToastAction;
  /** Optional application-owned translated supporting content. */
  description?: ReactNode;
  /** Auto-dismiss delay in finite non-negative milliseconds; `0` dismisses immediately and `null` persists. Defaults to `5000`. */
  lifetime?: number | null;
  /** Called once when the toast is dismissed, except during provider teardown. */
  onDismiss?: () => void;
  /** Application-owned translated primary content. */
  title: ReactNode;
  /** Bootstrap-aligned semantic colour. Defaults to `info`. */
  variant?: VisualVariant;
}

/** Provider-scoped commands for showing and dismissing toasts. */
export interface ToastController {
  /** Dismisses the toast with the returned queue identifier. */
  dismiss: (id: string) => void;
  /** Adds a toast and returns its provider-scoped queue identifier. */
  show: (options: ToastOptions) => string;
}

interface ToastContentData {
  action: ToastAction | undefined;
  description: ReactNode | undefined;
  title: ReactNode;
  variant: VisualVariant;
}

interface ToastContextValue {
  closeLabel: string;
  controller: ToastController;
  queue: AriaToastQueue<ToastContentData>;
  regionLabel: string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

type ToastNativeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role' | 'style' | 'title'
>;

/** Props for rendering an individually controlled toast. Prefer `useToast` for queued application notifications. */
export interface ToastProps extends ToastNativeProps {
  /** Optional application action. */
  action?: ToastAction;
  /** Accessible label for the dismiss button. Defaults to the provider close message. */
  closeLabel?: string;
  /** Optional application-owned translated supporting content. */
  description?: ReactNode;
  /** Called when the dismiss button or action closes the toast. */
  onDismiss: () => void;
  /** Ref to the rendered toast element. */
  ref?: Ref<HTMLDivElement>;
  /** Application-owned translated primary content. */
  title: ReactNode;
  /** Bootstrap-aligned semantic colour. Defaults to `info`. */
  variant?: VisualVariant;
}

interface ToastViewProps {
  action: ToastAction | undefined;
  closeLabel: string;
  description: ReactNode | undefined;
  onAction: (() => void) | undefined;
  onDismiss: () => void;
  title: ReactNode;
}

function ToastView({
  action,
  closeLabel,
  description,
  onAction,
  onDismiss,
  title,
}: Readonly<ToastViewProps>): ReactElement {
  return createElement(
    AriaToastContent,
    {
      className: toastContent(),
    },
    createElement(
      'div',
      {
        className: toastCopy(),
      },
      createElement(
        AriaText,
        {
          className: toastTitle(),
          slot: 'title',
        },
        title,
      ),
      description === undefined
        ? null
        : createElement(
            AriaText,
            {
              className: toastDescription(),
              slot: 'description',
            },
            description,
          ),
      action === undefined
        ? null
        : createElement(
            AriaButton,
            {
              className: toastAction(),
              onPress: onAction,
            },
            action.label,
          ),
    ),
    createElement(
      AriaButton,
      {
        'aria-label': closeLabel,
        className: toastClose(),
        onPress: onDismiss,
        slot: 'close',
      },
      '×',
    ),
  );
}

/**
 * Displays one explicitly controlled notification. Queued application
 * notifications should use `useToast`.
 *
 * @summary for explicitly controlled notifications outside the provider queue
 */
export function Toast({
  action,
  className,
  closeLabel,
  description,
  onDismiss,
  ref,
  title,
  variant = 'info',
  ...props
}: Readonly<ToastProps>): ReactElement {
  const { messages } = useBreezeContext();
  const titleId = useId();
  const descriptionId = useId();
  const actionHandler =
    action === undefined
      ? undefined
      : () => {
          action.onAction();
          onDismiss();
        };
  const rootProps: ComponentPropsWithRef<'div'> & {
    'data-variant': VisualVariant;
  } = {
    ...props,
    'aria-atomic': 'true',
    'aria-describedby': description === undefined ? undefined : descriptionId,
    'aria-labelledby': titleId,
    'aria-live': 'polite',
    'aria-modal': 'false',
    className: toastSurface({ class: className, variant }),
    'data-variant': variant,
    ref: useForwardedRef(ref),
    role: 'alertdialog',
    tabIndex: 0,
  };

  return createElement(
    'div',
    rootProps,
    createElement(
      'div',
      {
        className: toastContent(),
      },
      createElement(
        'div',
        {
          className: toastCopy(),
        },
        createElement('div', { className: toastTitle(), id: titleId }, title),
        description === undefined
          ? null
          : createElement(
              'div',
              {
                className: toastDescription(),
                id: descriptionId,
              },
              description,
            ),
        action === undefined
          ? null
          : createElement(
              AriaButton,
              {
                className: toastAction(),
                onPress: actionHandler,
              },
              action.label,
            ),
      ),
      createElement(
        AriaButton,
        {
          'aria-label': closeLabel ?? messages.close,
          className: toastClose(),
          onPress: onDismiss,
        },
        '×',
      ),
    ),
  );
}

/** Props for the provider-scoped toast stack. BreezeProvider renders this automatically. */
export interface ToastRegionProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role' | 'style'> {
  /** Accessible translated label for the notification stack. Defaults to the provider message. */
  label?: string;
  /** Ref to the rendered region element. */
  ref?: Ref<HTMLDivElement>;
}

/**
 * Renders the current provider's toast queue into its scoped portal host.
 * BreezeProvider already renders the primary region; add another only when an
 * advanced layout requires a separately labelled queue presentation.
 *
 * @summary for rendering an additional provider-scoped toast queue region
 */
export function ToastRegion({
  className,
  label,
  ref,
  ...props
}: Readonly<ToastRegionProps>): ReactElement | null {
  const context = useContext(ToastContext);
  const forwardedRef = useForwardedRef(ref);

  if (context === null) {
    throw new Error('ToastRegion must be rendered within BreezeProvider.');
  }

  const renderToast = ({
    toast,
  }: {
    toast: QueuedToast<ToastContentData>;
  }): ReactElement => {
    const { action, description, title, variant } = toast.content;
    const actionHandler =
      action === undefined
        ? undefined
        : () => {
            action.onAction();
            context.controller.dismiss(toast.key);
          };
    const queuedToastProps = {
      children: createElement(ToastView, {
        action,
        closeLabel: context.closeLabel,
        description,
        onAction: actionHandler,
        onDismiss: () => {
          context.controller.dismiss(toast.key);
        },
        title,
      }),
      className: toastSurface({ variant }),
      'data-variant': variant,
      toast,
    } as unknown as ComponentProps<typeof AriaToast<ToastContentData>>;

    return createElement(AriaToast<ToastContentData>, queuedToastProps);
  };
  const regionProps = {
    ...props,
    'aria-label': label ?? context.regionLabel,
    children: renderToast,
    className: toastRegion({ class: className }),
    queue: context.queue,
    ref: forwardedRef,
  } as ComponentProps<typeof AriaToastRegion<ToastContentData>>;

  return createElement(AriaToastRegion<ToastContentData>, regionProps);
}

interface ToastProviderBoundaryProps {
  children: ReactNode;
  closeLabel: string;
  limit: number;
  regionLabel: string;
}

function validateLifetime(lifetime: number | null): void {
  if (lifetime !== null && (!Number.isFinite(lifetime) || lifetime < 0)) {
    throw new RangeError(
      'Toast lifetime must be null or a finite non-negative number of milliseconds.',
    );
  }
}

/** @internal Establishes the queue owned by one BreezeProvider instance. */
export function ToastProviderBoundary({
  children,
  closeLabel,
  limit,
  regionLabel,
}: Readonly<ToastProviderBoundaryProps>): ReactElement {
  const queue = useMemo(
    () => new AriaToastQueue<ToastContentData>({ maxVisibleToasts: limit }),
    [limit],
  );
  const controller = useMemo<ToastController>(
    () => ({
      dismiss: (id) => {
        queue.close(id);
      },
      show: ({
        action,
        description,
        lifetime = DEFAULT_LIFETIME,
        onDismiss,
        title,
        variant = 'info',
      }) => {
        validateLifetime(lifetime);

        const id = queue.add(
          {
            action,
            description,
            title,
            variant,
          },
          {
            onClose: onDismiss,
            timeout: lifetime === null || lifetime === 0 ? undefined : lifetime,
          },
        );

        if (lifetime === 0) {
          queue.close(id);
        }

        return id;
      },
    }),
    [queue],
  );
  const context = useMemo<ToastContextValue>(
    () => ({
      closeLabel,
      controller,
      queue,
      regionLabel,
    }),
    [closeLabel, controller, queue, regionLabel],
  );

  useEffect(
    () => () => {
      queue.pauseAll();
      queue.clear();
    },
    [queue],
  );

  return createElement(
    ToastContext,
    {
      value: context,
    },
    children,
    createElement(ToastRegion),
  );
}

/**
 * Returns commands for showing and dismissing notifications in the nearest
 * BreezeProvider queue. Call this hook only below BreezeProvider.
 *
 * @summary for controlling the nearest BreezeProvider toast queue
 */
export function useToast(): ToastController {
  const context = useContext(ToastContext);

  if (context === null) {
    throw new Error('useToast must be called within BreezeProvider.');
  }

  return context.controller;
}
