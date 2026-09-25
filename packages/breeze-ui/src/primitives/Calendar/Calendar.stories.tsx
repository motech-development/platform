import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Calendar } from './Calendar';

const meta = {
  args: {
    defaultValue: '2026-09-03',
    label: 'Choose a date',
  },
  component: Calendar,
  title: 'Forms/Calendar',
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

function contrastRatio(element: HTMLElement) {
  const view = element.ownerDocument.defaultView;

  if (!view) throw new Error('Missing calendar story window.');

  const { backgroundColor, color } = view.getComputedStyle(element);
  const getLuminance = (cssColor: string) => {
    const channels = cssColor
      .match(/[\d.]+/g)
      ?.slice(0, 3)
      .map(Number);

    if (!channels || channels.length !== 3) {
      throw new Error(`Could not parse computed color: ${cssColor}`);
    }

    const [red, green, blue] = channels.map((channel) => {
      const normalized = channel / 255;

      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const foregroundLuminance = getLuminance(color);
  const backgroundLuminance = getLuminance(backgroundColor);

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  );
}

async function assertSelectedDateContrast(
  canvasElement: HTMLElement,
  appearance: 'dark' | 'light',
) {
  await expect(canvasElement.ownerDocument.documentElement.dataset.theme).toBe(
    appearance,
  );

  const selectedDate = within(canvasElement).getByRole('button', {
    name: /Thursday, 3 September 2026 selected/,
  });

  await expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);

  selectedDate.focus();
  await waitFor(() =>
    expect(selectedDate).toHaveAttribute('data-focused', 'true'),
  );
  await expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);

  selectedDate.blur();
  await waitFor(() => expect(selectedDate).not.toHaveAttribute('data-focused'));

  await userEvent.hover(selectedDate);
  await waitFor(() =>
    expect(selectedDate).toHaveAttribute('data-hovered', 'true'),
  );
  await expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);

  await userEvent.unhover(selectedDate);
  await waitFor(() => expect(selectedDate).not.toHaveAttribute('data-hovered'));

  selectedDate.setAttribute('data-outside-month', 'true');
  await expect(contrastRatio(selectedDate)).toBeGreaterThanOrEqual(4.5);
}

/** A six-week Monday-first calendar with a selected date. */
export const Default: Story = {};

/** A shape-preserving loading calendar does not expose selectable dates. */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

function CalendarLoadingFocusHarness() {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <button onClick={() => setLoading(true)} type="button">
        Start loading
      </button>
      <button onClick={() => setLoading(false)} type="button">
        Finish loading
      </button>
      <button type="button">Focus elsewhere</button>
      <Calendar
        defaultValue="2026-09-03"
        label="Choose a date"
        loading={loading}
      />
    </>
  );
}

function getColumnCenters(container: HTMLElement) {
  const center = (element: Element) => {
    const bounds = element.getBoundingClientRect();

    return (bounds.left + bounds.right) / 2;
  };
  const grid = container.querySelector('table[role="grid"]');

  if (grid) {
    const dateRow = grid.querySelector('tbody tr');

    if (!dateRow) throw new Error('Expected a calendar date row.');

    return {
      dates: Array.from(dateRow.children, center),
      weekdays: Array.from(grid.querySelectorAll('thead th'), center),
    };
  }

  const rows = Array.from(container.lastElementChild?.children ?? []);
  const weekdayRow = rows[0];
  const dateRow = rows[1];

  if (!weekdayRow || !dateRow) {
    throw new Error('Expected weekday and date skeleton rows.');
  }

  const skeletonCenters = (row: Element) =>
    Array.from(row.children, (cell) => center(cell.firstElementChild ?? cell));

  return {
    dates: skeletonCenters(dateRow),
    weekdays: skeletonCenters(weekdayRow),
  };
}

/** Keeps loading columns aligned and focus stable as the Calendar becomes ready. */
export const LoadingFocusManagement: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const readyColumnCenters = getColumnCenters(
      canvas.getByRole('application'),
    );
    const selectedDate = canvas.getByRole('button', {
      name: 'Thursday, 3 September 2026 selected',
    });
    const startLoadingButton = canvas.getByRole('button', {
      name: 'Start loading',
    });
    const finishLoadingButton = canvas.getByRole('button', {
      name: 'Finish loading',
    });
    const outsideButton = canvas.getByRole('button', {
      name: 'Focus elsewhere',
    });

    selectedDate.focus();
    await expect(selectedDate).toHaveFocus();
    startLoadingButton.click();
    const loadingProgress = await canvas.findByRole('progressbar', {
      name: 'Loading',
    });
    await expect(loadingProgress).toBeVisible();
    const loadingRegion = canvas.getByRole('region', {
      name: 'Choose a date',
    });
    const loadingColumnCenters = getColumnCenters(loadingRegion);
    const maximumColumnOffset = Math.max(
      ...readyColumnCenters.weekdays.map((readyCenter, index) =>
        Math.abs(readyCenter - loadingColumnCenters.weekdays[index]),
      ),
      ...readyColumnCenters.dates.map((readyCenter, index) =>
        Math.abs(readyCenter - loadingColumnCenters.dates[index]),
      ),
    );

    await expect(maximumColumnOffset).toBeLessThanOrEqual(4);
    finishLoadingButton.click();
    await waitFor(() => expect(selectedDate).toHaveFocus());

    startLoadingButton.click();
    await canvas.findByRole('progressbar', { name: 'Loading' });
    outsideButton.focus();
    outsideButton.blur();
    finishLoadingButton.click();
    await waitFor(() =>
      expect(
        canvas.queryByRole('progressbar', { name: 'Loading' }),
      ).not.toBeInTheDocument(),
    );

    const storyDocument = canvasElement.ownerDocument;
    await expect(storyDocument.activeElement).toBe(storyDocument.body);
  },
  render: () => <CalendarLoadingFocusHarness />,
};

/** A selected date keeps accessible contrast in the light appearance. */
export const SelectedContrastLight: Story = {
  globals: {
    appearance: 'light',
  },
  play: async ({ canvasElement }) => {
    await assertSelectedDateContrast(canvasElement, 'light');
  },
};

/** A selected date keeps accessible contrast in the dark appearance. */
export const SelectedContrastDark: Story = {
  globals: {
    appearance: 'dark',
  },
  play: async ({ canvasElement }) => {
    await assertSelectedDateContrast(canvasElement, 'dark');
  },
};

/** A calendar can prevent all date changes. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
