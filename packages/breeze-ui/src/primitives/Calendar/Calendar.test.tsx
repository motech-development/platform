import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import renderBreeze from '../../../test/render';
import { Calendar } from './Calendar';

describe('Calendar', () => {
  it('navigates its grid and reports stable selected dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderBreeze(
      <Calendar.Root defaultValue="2026-07-13" onChange={onChange}>
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar.Root>,
    );

    const calendar = within(screen.getByRole('application'));
    const calendarRoot = screen.getByRole('application');
    const grid = screen.getByRole('grid');

    const [next] = calendar.getAllByRole('button', { name: 'Next' });
    const [previous] = calendar.getAllByRole('button', { name: 'Previous' });

    expect(previous.querySelector('svg')).toHaveClass('lucide-arrow-left');
    expect(previous.querySelector('svg')).toHaveClass('rtl:rotate-180');
    expect(next.querySelector('svg')).toHaveClass('lucide-arrow-right');
    expect(next.querySelector('svg')).toHaveClass('rtl:rotate-180');
    expect(calendarRoot).toHaveClass('w-full');
    expect(grid).toHaveClass('w-full', 'table-fixed');
    expect(screen.getByRole('button', { name: /13.*July.*2026/i })).toHaveClass(
      'w-full',
    );
    await user.click(next);
    expect(
      calendar.getByRole('heading', { name: 'August 2026' }),
    ).toBeInTheDocument();
    await user.click(previous);
    await user.click(screen.getByRole('button', { name: /14.*July.*2026/i }));
    expect(onChange).toHaveBeenLastCalledWith('2026-07-14');
  });

  it('preserves explicit navigation content and accessible names', () => {
    renderBreeze(
      <Calendar.Root defaultValue="2026-07-13">
        <Calendar.Header>
          <Calendar.PreviousButton aria-label="Earlier month">
            Back
          </Calendar.PreviousButton>
          <Calendar.Heading />
          <Calendar.NextButton aria-label="Later month">
            Forward
          </Calendar.NextButton>
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar.Root>,
    );

    const previous = screen.getByRole('button', { name: 'Earlier month' });
    const next = screen.getByRole('button', { name: 'Later month' });

    expect(previous).toHaveTextContent('Back');
    expect(previous.querySelector('svg')).not.toBeInTheDocument();
    expect(next).toHaveTextContent('Forward');
    expect(next.querySelector('svg')).not.toBeInTheDocument();
  });

  it('mirrors only default navigation glyphs in right-to-left layouts', () => {
    renderBreeze(
      <Calendar.Root defaultValue="2026-07-13">
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton>Forward</Calendar.NextButton>
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar.Root>,
      { direction: 'rtl' },
    );

    const calendar = within(screen.getByRole('application'));
    const previous = calendar.getByRole('button', { name: 'Previous' });
    const next = calendar.getByText('Forward');

    expect(previous.querySelector('svg')).toHaveClass(
      'lucide-arrow-left',
      'rtl:rotate-180',
    );
    expect(next).toHaveTextContent('Forward');
    expect(next.querySelector('svg')).not.toBeInTheDocument();
  });

  it('uses React Aria localized navigation names by default', () => {
    renderBreeze(
      <Calendar.Root defaultValue="2026-07-13">
        <Calendar.Header>
          <Calendar.PreviousButton />
          <Calendar.Heading />
          <Calendar.NextButton />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar.Root>,
      { locale: 'fr-FR' },
    );

    const calendar = screen.getByRole('application');
    const previous = calendar.querySelector('[slot="previous"]');
    const next = calendar.querySelector('[slot="next"]');

    expect(previous).toBeInstanceOf(HTMLButtonElement);
    expect(previous).not.toHaveAccessibleName('Previous');
    expect(previous).toHaveAccessibleName();
    expect(next).toBeInstanceOf(HTMLButtonElement);
    expect(next).not.toHaveAccessibleName('Next');
    expect(next).toHaveAccessibleName();
  });

  it('preserves responsive calendar root and grid class overrides', () => {
    renderBreeze(
      <Calendar.Root className="max-w-full" defaultValue="2026-07-13">
        <Calendar.Header />
        <Calendar.Grid className="max-w-full" />
      </Calendar.Root>,
    );

    expect(screen.getByRole('application')).toHaveClass('w-full', 'max-w-full');
    expect(screen.getByRole('grid')).toHaveClass('w-full', 'max-w-full');
  });
});
