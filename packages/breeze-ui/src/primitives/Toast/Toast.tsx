import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useOverlayPortal } from '../../overlays/OverlayProvider';
import { useOverlayToastZIndex } from '../../overlays/OverlayStack';
import { useBreezeContext } from '../../provider/BreezeContext';
import { Icon } from '../Icon/Icon';

const toastLifetime = 2600;
const toastLimitError = 'BreezeProvider toastLimit must be a positive integer.';
const toastProviderError =
  'Toast components must be rendered within BreezeProvider.';

interface ToastItem {
  id: number;
  message: string;
}

export type ToastEnqueue = (message: string) => void;

const ToastContext = createContext<ToastEnqueue | null>(null);

export interface ToastProps {
  /** Translated confirmation message. */
  children: string;
}

/**
 * Displays a positive, non-interactive confirmation.
 *
 * @summary A transient confirmation status.
 */
export function Toast({ children }: Readonly<ToastProps>) {
  useBreezeContext();

  return (
    <div
      aria-atomic="true"
      aria-label={children}
      aria-live="polite"
      className="breeze-toast"
      role="status"
    >
      <Icon name="check" size="sm" />
      <span>{children}</span>
    </div>
  );
}

interface ToastProviderBoundaryProps {
  children: ReactNode;
  limit: number;
}

/** Establishes the queue owned by one BreezeProvider instance. */
export function ToastProviderBoundary({
  children,
  limit,
}: Readonly<ToastProviderBoundaryProps>) {
  const host = useOverlayPortal();
  const zIndex = useOverlayToastZIndex();
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError(toastLimitError);
  }

  const enqueue = useCallback<ToastEnqueue>((message) => {
    const id = nextId.current;
    nextId.current += 1;

    setQueue((current) => [...current, { id, message }]);
  }, []);
  const expireToast = useCallback((id: number) => {
    setQueue((current) => current.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (host === null) {
      return;
    }

    const visible = queue.slice(0, limit);
    const visibleIds = new Set(visible.map(({ id }) => id));

    visible.forEach((toast) => {
      if (!timers.current.has(toast.id)) {
        timers.current.set(
          toast.id,
          setTimeout(() => expireToast(toast.id), toastLifetime),
        );
      }
    });

    Array.from(timers.current.entries()).forEach(([id, timer]) => {
      if (!visibleIds.has(id)) {
        clearTimeout(timer);
        timers.current.delete(id);
      }
    });
  }, [expireToast, host, limit, queue]);

  useEffect(
    () => () => {
      Array.from(timers.current.values()).forEach((timer) =>
        clearTimeout(timer),
      );
      timers.current.clear();
    },
    [],
  );

  const visible = queue.slice(0, limit);

  return (
    <ToastContext value={enqueue}>
      {children}
      {host &&
        createPortal(
          <div
            aria-atomic="false"
            aria-live="polite"
            className="breeze-toast-region"
            data-breeze-toast-region=""
            data-live-announcer=""
            data-react-aria-top-layer=""
            style={{ zIndex }}
          >
            {visible.map(({ id, message }) => (
              <Toast key={id}>{message}</Toast>
            ))}
          </div>,
          host,
        )}
    </ToastContext>
  );
}

/** Enqueues a confirmation in the nearest BreezeProvider. */
export function useToast(): ToastEnqueue {
  const enqueue = useContext(ToastContext);

  if (enqueue === null) {
    throw new Error(toastProviderError);
  }

  return enqueue;
}
