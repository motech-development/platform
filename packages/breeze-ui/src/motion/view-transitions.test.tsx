import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RefCallback } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../test/render';
import { Drawer } from '../primitives/Drawer/Drawer';
import { Menu } from '../primitives/Menu/Menu';
import { BreezeProvider } from '../provider/BreezeProvider';
import {
  startViewTransition,
  startViewTransitionAndWait,
  useViewTransitionParticipant,
} from './view-transitions';

const originalViewTransitionDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'ViewTransition',
);
const originalStartViewTransitionDescriptor = Object.getOwnPropertyDescriptor(
  document,
  'startViewTransition',
);
const originalCssDescriptor = Object.getOwnPropertyDescriptor(window, 'CSS');
const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(
  window,
  'matchMedia',
);

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalCssDescriptor) {
    Object.defineProperty(window, 'CSS', originalCssDescriptor);
  } else {
    Reflect.deleteProperty(window, 'CSS');
  }
  if (originalMatchMediaDescriptor) {
    Object.defineProperty(window, 'matchMedia', originalMatchMediaDescriptor);
  } else {
    Reflect.deleteProperty(window, 'matchMedia');
  }
  if (originalViewTransitionDescriptor) {
    Object.defineProperty(
      window,
      'ViewTransition',
      originalViewTransitionDescriptor,
    );
  } else {
    Reflect.deleteProperty(window, 'ViewTransition');
  }
  if (originalStartViewTransitionDescriptor) {
    Object.defineProperty(
      document,
      'startViewTransition',
      originalStartViewTransitionDescriptor,
    );
  } else {
    Reflect.deleteProperty(document, 'startViewTransition');
  }
});

function installViewTransitionSupport(
  nativeStartViewTransition: Document['startViewTransition'],
  cssSupports = true,
  reducedMotion = false,
) {
  class MockViewTransition {}
  Object.defineProperty(MockViewTransition.prototype, 'types', {
    configurable: true,
    value: new Set<string>(),
  });
  Object.defineProperty(window, 'ViewTransition', {
    configurable: true,
    value: MockViewTransition,
  });
  Object.defineProperty(document, 'startViewTransition', {
    configurable: true,
    value: nativeStartViewTransition,
  });
  Object.defineProperty(window, 'CSS', {
    configurable: true,
    value: { supports: vi.fn(() => cssSupports) },
  });
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn((query: string) => ({
      addEventListener: vi.fn(),
      matches: query.includes('reduced-motion') && reducedMotion,
      media: query,
      removeEventListener: vi.fn(),
    })),
  });
}

function transition(update: () => void | Promise<void>) {
  const updateCallbackDone = Promise.resolve().then(update);
  return {
    finished: updateCallbackDone,
    ready: Promise.resolve(),
    skipTransition: vi.fn(),
    types: new Set<string>(),
    updateCallbackDone,
  } satisfies ViewTransition;
}

function runOptionsUpdate(options: StartViewTransitionOptions) {
  const update = options.update as (() => void | Promise<void>) | undefined;
  return update ? Promise.resolve(update()) : Promise.resolve();
}

describe('view transition API', () => {
  it('runs the update without motion when typed view transitions are unsupported', async () => {
    const update = vi.fn();
    const start = vi.fn();
    class UntypedViewTransition {}
    Object.defineProperty(document, 'startViewTransition', {
      configurable: true,
      value: start,
    });
    Object.defineProperty(window, 'ViewTransition', {
      configurable: true,
      value: UntypedViewTransition,
    });

    await startViewTransition(update, ['nav']);

    expect(update).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });

  it('runs an update once for empty types or reduced motion', async () => {
    const start = vi.fn();
    installViewTransitionSupport(start, true, false);
    const emptyUpdate = vi.fn();
    await startViewTransition(emptyUpdate, []);
    expect(emptyUpdate).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();

    installViewTransitionSupport(start, true, true);
    const reducedUpdate = vi.fn();
    await startViewTransition(reducedUpdate, ['mode']);
    expect(reducedUpdate).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });

  it('runs without motion when typed selectors are unsupported', async () => {
    const start = vi.fn();
    installViewTransitionSupport(start, false);
    const update = vi.fn();

    await startViewTransition(update, ['nav']);

    expect(update).toHaveBeenCalledOnce();
    expect(start).not.toHaveBeenCalled();
  });

  it('passes declared types, runs its update once and observes readiness rejection', async () => {
    const update = vi.fn();
    const ready = Promise.reject(new Error('transition names were duplicated'));
    const start = vi.fn((options: StartViewTransitionOptions) => ({
      ...transition(() => runOptionsUpdate(options)),
      ready,
    }));
    installViewTransitionSupport(start);

    await expect(
      startViewTransition(update, ['nav', 'list']),
    ).resolves.toBeUndefined();

    expect(start).toHaveBeenCalledOnce();
    const options = start.mock.calls[0]?.[0];
    expect(options?.types).toEqual(['nav', 'list']);
    expect(options?.update).toBeTypeOf('function');
    expect(update).toHaveBeenCalledOnce();
  });

  it('propagates update failures without retrying the callback', async () => {
    const failure = new Error('route commit failed');
    const update = vi.fn(() => Promise.reject(failure));
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    installViewTransitionSupport(start);

    await expect(startViewTransition(update, ['nav'])).rejects.toBe(failure);
    expect(update).toHaveBeenCalledOnce();
  });

  it('rejects native startup errors from the waiting API', async () => {
    const failure = new Error('native transition startup failed');
    const update = vi.fn();
    const start = vi.fn(() => {
      throw failure;
    });
    installViewTransitionSupport(start);

    const completion = startViewTransitionAndWait(update, ['expand']);

    expect(start).toHaveBeenCalledOnce();
    await expect(completion).rejects.toBe(failure);
    expect(update).not.toHaveBeenCalled();
  });

  it('rejects synchronous update errors from the waiting API', async () => {
    const failure = new Error('synchronous update failed');
    const update = vi.fn(() => {
      throw failure;
    });
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    installViewTransitionSupport(start);

    const completion = startViewTransitionAndWait(update, ['expand']);

    await expect(completion).rejects.toBe(failure);
    expect(update).toHaveBeenCalledOnce();
  });

  it('rejects asynchronous update errors from the waiting API', async () => {
    const failure = new Error('asynchronous update failed');
    const update = vi.fn(async () => {
      await Promise.resolve();
      throw failure;
    });
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    installViewTransitionSupport(start);

    const completion = startViewTransitionAndWait(update, ['expand']);

    await expect(completion).rejects.toBe(failure);
    expect(update).toHaveBeenCalledOnce();
  });

  it('observes the update callback rejection while waiting for animation finish', async () => {
    const failure = new Error('update callback failed');
    const updateCallbackDone = Promise.reject(failure);
    const finished = Promise.reject(failure);
    const start = vi.fn(() => ({
      finished,
      ready: Promise.resolve(),
      skipTransition: vi.fn(),
      types: new Set<string>(),
      updateCallbackDone,
    }));
    installViewTransitionSupport(start);

    await expect(
      startViewTransitionAndWait(() => undefined, ['expand']),
    ).rejects.toBe(failure);

    expect(start).toHaveBeenCalledOnce();
    expect(finished).not.toBe(updateCallbackDone);
  });

  it('skips an in-flight animation before starting the overlapping transition', async () => {
    let finishFirstTransition: (() => void) | undefined;
    let firstTransition: ReturnType<typeof transition> | undefined;
    const start = vi.fn((options: StartViewTransitionOptions) => {
      const current = transition(() => runOptionsUpdate(options));
      if (!firstTransition) {
        let finish: (() => void) | undefined;
        const finished = new Promise<void>((resolve) => {
          finish = resolve;
        });
        finishFirstTransition = finish;
        firstTransition = { ...current, finished };
      }
      if (start.mock.calls.length === 1) return firstTransition;
      return current;
    });
    installViewTransitionSupport(start);

    const first = startViewTransition(() => undefined, ['nav']);
    await first;
    expect(firstTransition).toBeDefined();

    await startViewTransition(() => undefined, ['mode']);

    expect(firstTransition?.skipTransition).toHaveBeenCalledOnce();
    expect(start).toHaveBeenCalledTimes(2);
    finishFirstTransition?.();
  });
});

function ParticipantProbe({
  hidden = false,
  inert = false,
  name,
  types,
}: Readonly<{
  hidden?: boolean;
  inert?: boolean;
  name: string;
  types: readonly ('nav' | 'mode' | 'list' | 'item' | 'expand')[];
}>) {
  const ref = useViewTransitionParticipant({ name, types });

  return <main data-testid={name} hidden={hidden} inert={inert} ref={ref} />;
}

const menuItems = [{ id: 'reports', label: 'Reports' }];

function holdExitAnimations() {
  let finish: () => void = () => undefined;
  const finished = new Promise<void>((resolve) => {
    finish = resolve;
  });

  vi.stubGlobal('CSSTransition', class {});
  Object.defineProperty(Element.prototype, 'getAnimations', {
    configurable: true,
    value: () => [{ finished }],
  });

  return () => {
    Reflect.deleteProperty(Element.prototype, 'getAnimations');
    finish();
  };
}

function TopbarProbe() {
  const ref = useViewTransitionParticipant({ role: 'topbar' });

  return <header data-testid="topbar" ref={ref} />;
}

describe('useViewTransitionParticipant', () => {
  it('declares a typed name through its ref without setting a permanent transition name', () => {
    renderBreeze(
      <ParticipantProbe name="accounts-page" types={['nav', 'mode']} />,
    );

    const participant = screen.getByTestId('accounts-page');
    expect(participant).toHaveAttribute(
      'data-breeze-transition-name',
      'accounts-page',
    );
    expect(participant).toHaveAttribute(
      'data-breeze-transition-types',
      'nav mode',
    );
    expect(participant).toHaveAttribute(
      'data-breeze-transition-enabled',
      'true',
    );
    expect(participant.style.viewTransitionName).toBe('');
  });

  it('provides the closed chrome and navmark singleton roles', () => {
    const roles = ['topbar', 'topnav', 'botnav', 'navmark'] as const;

    function RoleProbe({ role }: Readonly<{ role: (typeof roles)[number] }>) {
      const ref = useViewTransitionParticipant({ role });
      return <span data-testid={role} ref={ref} />;
    }

    renderBreeze(
      <>
        {roles.map((role) => (
          <RoleProbe key={role} role={role} />
        ))}
      </>,
    );

    expect(screen.getByTestId('topbar')).toHaveAttribute(
      'data-breeze-transition-name',
      'breeze-topbar',
    );
    expect(screen.getByTestId('topbar')).toHaveAttribute(
      'data-breeze-transition-types',
      'nav mode',
    );
    expect(screen.getByTestId('topnav')).toHaveAttribute(
      'data-breeze-transition-name',
      'breeze-topnav',
    );
    expect(screen.getByTestId('botnav')).toHaveAttribute(
      'data-breeze-transition-name',
      'breeze-botnav',
    );
    expect(screen.getByTestId('navmark')).toHaveAttribute(
      'data-breeze-transition-name',
      'breeze-navmark',
    );
    expect(screen.getByTestId('navmark')).toHaveAttribute(
      'data-breeze-transition-types',
      'nav',
    );
  });

  it('reports duplicate eligible names in both snapshots in development', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    renderBreeze(
      <>
        <ParticipantProbe name="duplicate-row" types={['list']} />
        <ParticipantProbe name="duplicate-row" types={['list']} />
      </>,
    );
    screen.getAllByTestId('duplicate-row').forEach((element) => {
      Object.defineProperty(element, 'getClientRects', {
        configurable: true,
        value: () => [{ height: 1, width: 1 }],
      });
    });
    installViewTransitionSupport(start);

    await startViewTransition(() => undefined, ['list']);

    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('in the old snapshot'),
    );
    expect(error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('in the new snapshot'),
    );
  });

  it('reports duplicate names across the union of requested transition types', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    renderBreeze(
      <>
        <ParticipantProbe name="shared-name" types={['nav']} />
        <ParticipantProbe name="shared-name" types={['list']} />
      </>,
    );
    screen.getAllByTestId('shared-name').forEach((element) => {
      Object.defineProperty(element, 'getClientRects', {
        configurable: true,
        value: () => [{ height: 1, width: 1 }],
      });
    });
    installViewTransitionSupport(start);

    await startViewTransition(() => undefined, ['nav', 'list']);

    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenCalledWith(
      expect.stringContaining('duplicate participant name "shared-name"'),
    );
  });

  it('reserves the browser root participant name', () => {
    expect(() =>
      renderBreeze(<ParticipantProbe name="root" types={['nav']} />),
    ).toThrow(/reserved by the browser or Breeze/);
  });

  it.each(['default', 'DEFAULT', 'match-element', 'MATCH-ELEMENT'])(
    'rejects reserved participant name %s case-insensitively',
    (name) => {
      expect(() =>
        renderBreeze(<ParticipantProbe name={name} types={['nav']} />),
      ).toThrow(/reserved by the browser or Breeze/);
    },
  );

  it('reports duplicate names when one visible participant is inert', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    renderBreeze(
      <>
        <ParticipantProbe name="inert-duplicate" types={['list']} />
        <ParticipantProbe inert name="inert-duplicate" types={['list']} />
      </>,
    );
    const participants = screen.getAllByTestId('inert-duplicate');
    expect(participants[1]).toHaveAttribute('inert');
    participants.forEach((element) => {
      Object.defineProperty(element, 'getClientRects', {
        configurable: true,
        value: () => [{ height: 1, width: 1 }],
      });
    });
    installViewTransitionSupport(start);

    await startViewTransition(() => undefined, ['list']);

    expect(error).toHaveBeenCalledTimes(2);
    expect(error).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('in the old snapshot'),
    );
    expect(error).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('in the new snapshot'),
    );
  });

  it('restores absent, empty and existing participant dataset values', () => {
    let participantRef: RefCallback<HTMLElement> | undefined;
    function CaptureParticipantRef() {
      participantRef = useViewTransitionParticipant({
        name: 'replacement-name',
        types: ['nav'],
      });
      return null;
    }

    renderBreeze(<CaptureParticipantRef />);
    const element = document.createElement('span');
    element.dataset.breezeTransitionName = '';
    element.dataset.breezeTransitionTypes = 'list';

    const cleanup = participantRef?.(element);

    expect(element.dataset.breezeTransitionName).toBe('replacement-name');
    expect(element.dataset.breezeTransitionTypes).toBe('nav');
    expect(element.dataset.breezeTransitionEnabled).toBe('true');
    if (typeof cleanup === 'function') cleanup();

    expect(element.dataset.breezeTransitionName).toBe('');
    expect(element.dataset.breezeTransitionTypes).toBe('list');
    expect(element.dataset.breezeTransitionEnabled).toBeUndefined();
  });

  it('ignores hidden responsive copies when checking eligible names', async () => {
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const start = vi.fn((options: StartViewTransitionOptions) =>
      transition(() => runOptionsUpdate(options)),
    );
    renderBreeze(
      <>
        <ParticipantProbe name="duplicate-row" types={['list']} />
        <ParticipantProbe hidden name="duplicate-row" types={['list']} />
      </>,
    );
    const duplicateParticipants = screen.getAllByTestId('duplicate-row');
    const visibleParticipant = duplicateParticipants[0];
    expect(duplicateParticipants[1]).toHaveAttribute('hidden');
    if (!visibleParticipant) throw new Error('Missing visible participant');
    Object.defineProperty(visibleParticipant, 'getClientRects', {
      configurable: true,
      value: () => [{ height: 1, width: 1 }],
    });
    duplicateParticipants.slice(1).forEach((element) => {
      Object.defineProperty(element, 'getClientRects', {
        configurable: true,
        value: () => [{ height: 1, width: 1 }],
      });
    });
    installViewTransitionSupport(start);

    await startViewTransition(() => undefined, ['list']);

    expect(error).not.toHaveBeenCalled();
  });

  it('enables participants only in the topmost overlay layer', async () => {
    function OverlayParticipant() {
      return <ParticipantProbe name="overlay-item" types={['item']} />;
    }

    render(
      <BreezeProvider locale="en-GB">
        <ParticipantProbe name="page-item" types={['item']} />
        <Drawer title="Details" trigger="Open details">
          <OverlayParticipant />
        </Drawer>
      </BreezeProvider>,
    );

    const pageParticipant = screen.getByTestId('page-item');
    await userEvent.click(screen.getByRole('button', { name: 'Open details' }));

    expect(pageParticipant).toHaveAttribute(
      'data-breeze-transition-enabled',
      'false',
    );
    expect(await screen.findByTestId('overlay-item')).toHaveAttribute(
      'data-breeze-transition-enabled',
      'true',
    );
  });

  it('re-enables page participants while a closing menu exits', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TopbarProbe />
        <ParticipantProbe name="page-item" types={['nav']} />
        <Menu getItem={(item) => item} items={menuItems} trigger="Account" />
      </BreezeProvider>,
    );

    const topbar = screen.getByTestId('topbar');
    const pageParticipant = screen.getByTestId('page-item');

    await user.click(screen.getByRole('button', { name: 'Account' }));

    expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'false');
    expect(pageParticipant).toHaveAttribute(
      'data-breeze-transition-enabled',
      'false',
    );

    const finishExit = holdExitAnimations();

    try {
      await user.click(screen.getByRole('menuitem', { name: 'Reports' }));

      // Still exiting, as when a navigation captures its old snapshot.
      expect(
        screen.getByRole('menu').closest('[data-exiting]'),
      ).toBeInTheDocument();
      expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'true');
      expect(pageParticipant).toHaveAttribute(
        'data-breeze-transition-enabled',
        'true',
      );
    } finally {
      finishExit();
    }

    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'true');
  });

  it('returns names to the containing overlay while its menu exits', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <Drawer defaultOpen title="Details" trigger="Open details">
          <ParticipantProbe name="overlay-item" types={['item']} />
          <Menu
            getItem={(item) => item}
            items={menuItems}
            trigger="Record actions"
          />
        </Drawer>
      </BreezeProvider>,
    );

    const drawer = await screen.findByRole('dialog', { name: 'Details' });
    const overlayParticipant = within(drawer).getByTestId('overlay-item');

    await user.click(
      within(drawer).getByRole('button', { name: 'Record actions' }),
    );
    expect(overlayParticipant).toHaveAttribute(
      'data-breeze-transition-enabled',
      'false',
    );

    const finishExit = holdExitAnimations();

    try {
      await user.click(screen.getByRole('menuitem', { name: 'Reports' }));

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(overlayParticipant).toHaveAttribute(
        'data-breeze-transition-enabled',
        'true',
      );
    } finally {
      finishExit();
    }
  });

  it('keeps page participants withheld while a closing modal exits', async () => {
    const user = userEvent.setup();

    render(
      <BreezeProvider locale="en-GB">
        <TopbarProbe />
        <Drawer defaultOpen title="Details" trigger="Open details">
          Content
        </Drawer>
      </BreezeProvider>,
    );

    const topbar = screen.getByTestId('topbar');

    await screen.findByRole('dialog', { name: 'Details' });
    expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'false');

    const finishExit = holdExitAnimations();

    try {
      await user.keyboard('{Escape}');

      expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'false');
    } finally {
      finishExit();
    }

    await waitFor(() =>
      expect(topbar).toHaveAttribute('data-breeze-transition-enabled', 'true'),
    );
  });
});
