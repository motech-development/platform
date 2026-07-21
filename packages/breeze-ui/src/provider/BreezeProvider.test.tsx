import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BreezeProvider } from './BreezeProvider';

describe('BreezeProvider', () => {
  it('places the scoped portal host beside the application root', () => {
    const { container } = render(
      <BreezeProvider direction="rtl" locale="ar">
        <main>Content</main>
      </BreezeProvider>,
    );
    const applicationRoot = container.querySelector(
      '[data-breeze-root]:not([data-breeze-portal-root])',
    );
    const portalRoot = document.body.querySelector('[data-breeze-portal-root]');

    expect(portalRoot?.parentElement).toBe(document.body);
    expect(applicationRoot?.contains(portalRoot)).toBe(false);
    expect(portalRoot).toHaveAttribute('data-breeze-root', '');
    expect(portalRoot).toHaveAttribute('dir', 'rtl');
    expect(portalRoot).toHaveAttribute('lang', 'ar');
    expect(portalRoot).toBeEmptyDOMElement();
  });
  it('establishes the locale and inferred text direction for Breeze content', () => {
    render(
      <BreezeProvider locale="ar-SA">
        <span>محتوى</span>
      </BreezeProvider>,
    );

    const root = screen.getByText('محتوى').parentElement;

    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('lang', 'ar-SA');
  });

  it('allows the inferred text direction to be overridden', () => {
    render(
      <BreezeProvider direction="ltr" locale="ar-SA">
        <span>Content</span>
      </BreezeProvider>,
    );

    expect(screen.getByText('Content').parentElement).toHaveAttribute(
      'dir',
      'ltr',
    );
  });

  it('creates a local portal host for layered content', () => {
    render(
      <BreezeProvider locale="en-GB">
        <span>Content</span>
      </BreezeProvider>,
    );

    expect(
      document.body.querySelector('[data-breeze-portal-root]'),
    ).toBeInTheDocument();
  });

  it('rejects a non-positive toast stack limit', () => {
    expect(() =>
      render(
        <BreezeProvider locale="en-GB" toastLimit={0}>
          <span>Content</span>
        </BreezeProvider>,
      ),
    ).toThrow(RangeError);
  });
});
