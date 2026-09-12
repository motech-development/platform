import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useSyncExternalStore,
} from 'react';
import type { OverlayKind } from './overlay.types';

interface Layer {
  active: boolean;
  id: string;
  kind: OverlayKind;
  parent?: string;
}

/** Breeze owns ordering; React Aria still owns modality, focus and animations. */
export function createOverlayStack() {
  let layers: Layer[] = [];
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach((listener) => listener());

  return {
    getSnapshot: () => layers,
    remove: (id: string) => {
      layers = layers.filter((layer) => layer.id !== id);
      publish();
    },
    set: (layer: Layer) => {
      const previous = layers.find((entry) => entry.id === layer.id);
      if (previous?.active === layer.active && previous.parent === layer.parent)
        return;
      // Reopening goes above other siblings, while closing retains exit geometry.
      layers =
        previous && !layer.active
          ? layers.map((entry) => (entry.id === layer.id ? layer : entry))
          : [...layers.filter((entry) => entry.id !== layer.id), layer];
      publish();
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export const OverlayStackContext = createContext<ReturnType<
  typeof createOverlayStack
> | null>(null);
export const ParentOverlayContext = createContext<{
  id: string;
  open: boolean;
  restoreFocus: () => void;
} | null>(null);

export function useOverlayLayer(kind: OverlayKind, open: boolean) {
  const store = useContext(OverlayStackContext);
  const parent = useContext(ParentOverlayContext);
  const id = useId();
  if (!store)
    throw new Error(
      'Breeze components must be rendered within BreezeProvider.',
    );
  const layers = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  const parentId = parent?.id;

  useLayoutEffect(() => () => store.remove(id), [id, store]);
  useLayoutEffect(() => {
    store.set({ active: open, id, kind, parent: parentId });
  }, [id, kind, open, parentId, store]);

  // Effects mount children first. Walk ancestry rather than relying on effect order.
  const ordered: Layer[] = [];
  const append = (layer: Layer) => {
    if (ordered.includes(layer)) return;
    const ancestor = layers.find((entry) => entry.id === layer.parent);
    if (ancestor) append(ancestor);
    ordered.push(layer);
  };
  layers.forEach(append);
  const isActive = (layer: Layer): boolean => {
    const ancestor = layers.find((entry) => entry.id === layer.parent);
    return layer.active && (!ancestor || isActive(ancestor));
  };
  const active = ordered.filter(isActive);
  const activeIndex = active.findIndex((layer) => layer.id === id);
  const interactive =
    open &&
    activeIndex !== -1 &&
    !active.slice(activeIndex + 1).some((layer) => layer.kind !== 'popover');
  const topmost = open && active.at(-1)?.id === id;
  const scrim =
    open &&
    active
      .filter((layer) => layer.kind === 'drawer' || layer.kind === 'dialog')
      .at(-1)?.id === id;

  return {
    id,
    interactive,
    scrim,
    topmost,
    zIndex:
      100 +
      Math.max(
        0,
        ordered.findIndex((layer) => layer.id === id),
      ) *
        2,
  };
}
