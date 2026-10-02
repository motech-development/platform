import {
  type RefCallback,
  useCallback,
  useContext,
  useSyncExternalStore,
} from 'react';
import {
  createOverlayStack,
  OverlayStackContext,
  ParentOverlayContext,
} from '../overlays/OverlayStack';
import { useBreezeContext } from '../provider/BreezeContext';

/** Transition vocabulary supported by Breeze's recipes. */
export type ViewTransitionType = 'nav' | 'mode' | 'list' | 'item' | 'expand';

const transitionTypes: readonly ViewTransitionType[] = [
  'nav',
  'mode',
  'list',
  'item',
  'expand',
];
const transitionTypeSet = new Set<string>(transitionTypes);
const participantNamePattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
const reservedParticipantNames = new Set([
  'auto',
  'default',
  'inherit',
  'initial',
  'none',
  'revert',
  'revert-layer',
  'unset',
  'root',
  'breeze-botnav',
  'breeze-navmark',
  'breeze-topbar',
  'breeze-topnav',
  'match-element',
]);
const singletonParticipants = {
  botnav: { name: 'breeze-botnav', types: ['nav', 'mode'] },
  navmark: { name: 'breeze-navmark', types: ['nav'] },
  topbar: { name: 'breeze-topbar', types: ['nav', 'mode'] },
  topnav: { name: 'breeze-topnav', types: ['nav', 'mode'] },
} as const;

export type ViewTransitionRole = keyof typeof singletonParticipants;

export type ViewTransitionParticipantOptions =
  | Readonly<{
      name: string;
      types: readonly ViewTransitionType[];
    }>
  | Readonly<{
      role: ViewTransitionRole;
    }>;

function normalizeTypes(
  types: readonly ViewTransitionType[],
): ViewTransitionType[] {
  const normalized = [...new Set(types)];

  if (normalized.some((type) => !transitionTypeSet.has(type))) {
    throw new TypeError(
      'Breeze view transition types must be nav, mode, list, item or expand.',
    );
  }

  return normalized;
}

function supportsTypedViewTransitions(
  document: Document,
  types: readonly ViewTransitionType[],
) {
  const view = document.defaultView;
  const viewTransitionConstructor = view?.ViewTransition;
  const supports = view?.CSS?.supports;

  return (
    types.length > 0 &&
    typeof document.startViewTransition === 'function' &&
    typeof viewTransitionConstructor === 'function' &&
    'types' in viewTransitionConstructor.prototype &&
    typeof supports === 'function' &&
    types.every((type) =>
      supports.call(
        view?.CSS,
        `selector(:active-view-transition-type(${type}))`,
      ),
    )
  );
}

function prefersReducedMotion(document: Document) {
  return (
    document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)')
      .matches ?? false
  );
}

function isEligibleParticipant(element: HTMLElement, document: Document) {
  if (
    !element.isConnected ||
    element.matches('[data-breeze-overlay]') ||
    element.closest('[hidden]') !== null ||
    element.getClientRects().length === 0
  ) {
    return false;
  }

  const style = document.defaultView?.getComputedStyle(element);
  return (
    style !== undefined &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.visibility !== 'collapse'
  );
}

function reportDuplicateNames(
  document: Document,
  types: readonly ViewTransitionType[],
  snapshot: 'old' | 'new',
) {
  if (process.env.NODE_ENV === 'production') return;

  const participants = Array.from(
    document.querySelectorAll<HTMLElement>(
      '[data-breeze-transition-enabled="true"][data-breeze-transition-name]',
    ),
  ).filter((element) => isEligibleParticipant(element, document));

  const names = new Map<string, number>();
  participants.forEach((element) => {
    const elementTypes = element.dataset.breezeTransitionTypes?.split(/\s+/);
    if (
      elementTypes?.some((type) => types.includes(type as ViewTransitionType))
    ) {
      const name = element.dataset.breezeTransitionName;
      if (name) names.set(name, (names.get(name) ?? 0) + 1);
    }
  });

  names.forEach((count, name) => {
    if (count > 1) {
      console.error(
        `Breeze view transition types "${types.join(', ')}" have duplicate participant name "${name}" in the ${snapshot} snapshot. Eligible names must be unique in both snapshots.`,
      );
    }
  });
}

const activeTransitions = new WeakMap<Document, ViewTransition>();

function beginViewTransition(
  update: () => void | Promise<void>,
  requestedTypes: readonly ViewTransitionType[],
): Pick<ViewTransition, 'finished' | 'updateCallbackDone'> {
  const types = normalizeTypes(requestedTypes);
  const { document } = globalThis;

  if (
    document === undefined ||
    types.length === 0 ||
    !supportsTypedViewTransitions(document, types) ||
    prefersReducedMotion(document)
  ) {
    try {
      const immediate = Promise.resolve(update());
      return {
        finished: immediate,
        updateCallbackDone: immediate,
      };
    } catch (error) {
      const failed = Promise.reject(
        error instanceof Error ? error : new Error(String(error)),
      );
      return {
        finished: failed,
        updateCallbackDone: failed,
      };
    }
  }

  reportDuplicateNames(document, types, 'old');
  activeTransitions.get(document)?.skipTransition();

  const transition = document.startViewTransition({
    types,
    update: async () => {
      await update();
      reportDuplicateNames(document, types, 'new');
    },
  });
  activeTransitions.set(document, transition);

  // A duplicate name can reject `ready` after the update has already run.
  // Keep that diagnostic rejection observed; updateCallbackDone still exposes
  // failures from the router's actual DOM commit to the adapter.
  transition.ready.catch(() => undefined);
  const clearActiveTransition = () => {
    if (activeTransitions.get(document) === transition) {
      activeTransitions.delete(document);
    }
  };
  // The document may finish its update callback before the animation ends.
  // Keep the transition active until `finished` so overlapping routes are
  // skipped even when the first DOM commit has already completed.
  transition.finished.then(clearActiveTransition, clearActiveTransition);

  return transition;
}

/** Runs an application-owned DOM commit inside an opted-in browser transition. */
export function startViewTransition(
  update: () => void | Promise<void>,
  requestedTypes: readonly ViewTransitionType[],
): Promise<void> {
  return beginViewTransition(update, requestedTypes).updateCallbackDone;
}

/** Waits for a Breeze-owned transition's animation, for staged content swaps. */
export async function startViewTransitionAndWait(
  update: () => void | Promise<void>,
  requestedTypes: readonly ViewTransitionType[],
): Promise<void> {
  const transition = beginViewTransition(update, requestedTypes);
  transition.updateCallbackDone.catch(() => undefined);

  await transition.finished;
}

/** Resolves after the current transition, if any, has finished its animation. */
export function waitForCurrentViewTransition(): Promise<void> {
  const { document } = globalThis;
  const transition = document && activeTransitions.get(document);

  if (!transition) return Promise.resolve();

  return transition.finished.then(
    () => undefined,
    () => undefined,
  );
}

type OverlayStackSnapshot = ReturnType<
  ReturnType<typeof createOverlayStack>['getSnapshot']
>;
type OverlayLayer = OverlayStackSnapshot[number];

function orderedVisualLayers(layers: OverlayStackSnapshot) {
  const ordered: OverlayLayer[] = [];
  const append = (layer: OverlayLayer) => {
    if (ordered.includes(layer)) return;
    const ancestor = layers.find((entry) => entry.id === layer.parent);
    if (ancestor) append(ancestor);
    ordered.push(layer);
  };
  layers.forEach(append);
  // A closing popover stays visual while its exit animation runs, so that its
  // geometry holds. Once inactive it is no longer the layer a person is using,
  // and it is non-modal, so it must not withhold names from the layer beneath:
  // a menu item that starts a navigation would otherwise capture the old
  // snapshot while the menu fades out, without the pinned shell chrome.
  const isClosingPopover = (layer: OverlayLayer) =>
    layer.kind === 'popover' && !layer.active;
  const isVisual = (layer: OverlayLayer): boolean => {
    const ancestor = layers.find((entry) => entry.id === layer.parent);
    return (
      layer.visual &&
      !isClosingPopover(layer) &&
      (!ancestor || isVisual(ancestor))
    );
  };

  return ordered.filter(isVisual);
}

/** Declares a unique name that Breeze CSS grants only for its listed types. */
export function useViewTransitionParticipant<
  Element extends HTMLElement = HTMLElement,
>(participant: ViewTransitionParticipantOptions): RefCallback<Element> {
  useBreezeContext();
  const store = useContext(OverlayStackContext);
  const parent = useContext(ParentOverlayContext);

  if (store === null) {
    throw new Error(
      'Breeze components must be rendered within BreezeProvider.',
    );
  }

  const layers = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
  const visibleLayers = orderedVisualLayers(layers);
  const enabled = parent
    ? visibleLayers.at(-1)?.id === parent.id
    : visibleLayers.length === 0;
  const role =
    'role' in participant ? singletonParticipants[participant.role] : undefined;
  const name = role?.name ?? (participant as { name: string }).name;
  const types = normalizeTypes(
    role?.types ??
      (participant as { types: readonly ViewTransitionType[] }).types,
  );

  if (
    !participantNamePattern.test(name) ||
    (role === undefined && reservedParticipantNames.has(name.toLowerCase()))
  ) {
    throw new TypeError(
      'Breeze transition participant names must be CSS custom identifiers and cannot use a name reserved by the browser or Breeze.',
    );
  }
  if (types.length === 0) {
    throw new RangeError(
      'Breeze transition participants require at least one transition type.',
    );
  }

  const typesAttribute = types.join(' ');

  return useCallback(
    (element) => {
      if (element === null) return undefined;

      const { dataset } = element;
      const previousName = dataset.breezeTransitionName;
      const previousTypes = dataset.breezeTransitionTypes;
      const previousEnabled = dataset.breezeTransitionEnabled;
      const previousVariable = element.style.getPropertyValue(
        '--breeze-transition-name',
      );
      const previousPriority = element.style.getPropertyPriority(
        '--breeze-transition-name',
      );

      dataset.breezeTransitionName = name;
      dataset.breezeTransitionTypes = typesAttribute;
      dataset.breezeTransitionEnabled = String(enabled);
      element.style.setProperty('--breeze-transition-name', name);

      return () => {
        if (previousName === undefined) {
          delete dataset.breezeTransitionName;
        } else {
          dataset.breezeTransitionName = previousName;
        }
        if (previousTypes === undefined) {
          delete dataset.breezeTransitionTypes;
        } else {
          dataset.breezeTransitionTypes = previousTypes;
        }
        if (previousEnabled === undefined) {
          delete dataset.breezeTransitionEnabled;
        } else {
          dataset.breezeTransitionEnabled = previousEnabled;
        }
        if (previousVariable === '') {
          element.style.removeProperty('--breeze-transition-name');
        } else {
          element.style.setProperty(
            '--breeze-transition-name',
            previousVariable,
            previousPriority,
          );
        }
      };
    },
    [enabled, name, typesAttribute],
  );
}
