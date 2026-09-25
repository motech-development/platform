import { screen, waitFor } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Calendar } from '../src/primitives/Calendar/Calendar';
import renderBreeze from '../test/render';
import '../src/styles/reset.css';
import '../src/styles/styles.css';

function relativeLuminance(color: string) {
  const channels = color
    .match(/[\d.]+/g)
    ?.slice(0, 3)
    .map(Number);

  if (!channels || channels.length !== 3) {
    throw new Error(`Could not parse computed color: ${color}`);
  }

  const [red, green, blue] = channels.map((channel) => {
    const normalized = channel / 255;

    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(element: HTMLElement) {
  const { backgroundColor, color } = getComputedStyle(element);
  const foregroundLuminance = relativeLuminance(color);
  const backgroundLuminance = relativeLuminance(backgroundColor);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

it.each(['light', 'dark'] as const)(
  'keeps selected dates at 4.5:1 contrast in %s appearance',
  async (appearance) => {
    renderBreeze(
      <Calendar
        label="Choose date"
        onChange={() => undefined}
        value="2026-09-03"
      />,
      'en-GB',
      { defaultAppearance: appearance },
    );

    expect(document.documentElement).toHaveAttribute('data-theme', appearance);

    const selectedDate = screen.getByRole('button', {
      name: /Thursday, 3 September 2026 selected/,
    });

    expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);

    selectedDate.focus();
    await waitFor(() => {
      expect(selectedDate).toHaveAttribute('data-focused', 'true');
    });
    expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);

    // Exercise both styles together even though React Aria keeps a
    // controlled selection inside the displayed month during navigation.
    selectedDate.setAttribute('data-outside-month', 'true');

    expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);
  },
);
