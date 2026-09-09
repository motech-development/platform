import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../primitives/Button/Button';
import { useBreezeContext } from './BreezeContext';
import { BreezeProvider } from './BreezeProvider';

const mediaListeners = new Set<(event: MediaQueryListEvent) => void>();
let prefersDark = false;

function AppearanceProbe() {
  const { appearance, resolvedAppearance } = useBreezeContext();

  return <output>{`${appearance}:${resolvedAppearance}`}</output>;
}

describe('BreezeProvider', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    mediaListeners.clear();
    prefersDark = false;
    vi.stubGlobal('matchMedia', (query: string) => ({
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => mediaListeners.add(listener),
      get matches() {
        return prefersDark;
      },
      media: query,
      removeEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => mediaListeners.delete(listener),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('rejects a component outside the required provider', () => {
    expect(() => render(<Button>Save</Button>)).toThrow(
      'Breeze components must be rendered within BreezeProvider.',
    );
  });

  it('updates the language inherited by its content when the locale changes', () => {
    const { rerender } = render(
      <BreezeProvider locale="en-GB">
        <Button>Save</Button>
      </BreezeProvider>,
    );

    expect(screen.getByRole('button').closest('[lang]')).toHaveAttribute(
      'lang',
      'en-GB',
    );

    rerender(
      <BreezeProvider locale="fr-FR">
        <Button>Enregistrer</Button>
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('button', { name: 'Enregistrer' }).closest('[lang]'),
    ).toHaveAttribute('lang', 'fr-FR');
  });

  it('resolves automatic appearance and follows operating system changes', () => {
    render(
      <BreezeProvider defaultAppearance="automatic" locale="en-GB">
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(screen.getByText('automatic:light')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(document.documentElement.style.colorScheme).toBe('light');

    prefersDark = true;
    act(() => {
      mediaListeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(screen.getByText('automatic:dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('keeps a controlled appearance until its owner changes it', () => {
    const onAppearanceChange = vi.fn();
    const { rerender } = render(
      <BreezeProvider
        appearance="light"
        locale="en-GB"
        onAppearanceChange={onAppearanceChange}
      >
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(screen.getByText('light:light')).toBeInTheDocument();

    rerender(
      <BreezeProvider
        appearance="dark"
        locale="en-GB"
        onAppearanceChange={onAppearanceChange}
      >
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(screen.getByText('dark:dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('uses the current operating system preference when returning to automatic', () => {
    const onAppearanceChange = vi.fn();
    const { rerender } = render(
      <BreezeProvider
        appearance="light"
        locale="en-GB"
        onAppearanceChange={onAppearanceChange}
      >
        <AppearanceProbe />
      </BreezeProvider>,
    );

    prefersDark = true;
    act(() => {
      mediaListeners.forEach((listener) =>
        listener({ matches: true } as MediaQueryListEvent),
      );
    });

    expect(screen.getByText('light:light')).toBeInTheDocument();

    rerender(
      <BreezeProvider
        appearance="automatic"
        locale="en-GB"
        onAppearanceChange={onAppearanceChange}
      >
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(screen.getByText('automatic:dark')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('does not follow operating system changes for an explicit appearance', () => {
    prefersDark = true;

    render(
      <BreezeProvider defaultAppearance="light" locale="en-GB">
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(screen.getByText('light:light')).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it('does not use durable browser storage', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem');
    const setItem = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <BreezeProvider defaultAppearance="dark" locale="en-GB">
        <AppearanceProbe />
      </BreezeProvider>,
    );

    expect(getItem).not.toHaveBeenCalled();
    expect(setItem).not.toHaveBeenCalled();
  });

  it('uses an English fallback when a message override is undefined', () => {
    render(
      <BreezeProvider locale="en-GB" messages={{ loading: undefined }}>
        <Button loading>Save</Button>
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('progressbar', { name: 'Loading' }),
    ).toBeInTheDocument();
  });
});
