import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { BreezeProvider } from '../../provider/BreezeProvider';
import {
  StatePanel,
  type StatePanelAction,
  type StatePanelProps,
} from './StatePanel';

expectTypeOf<StatePanelProps>().not.toHaveProperty('children');
expectTypeOf<StatePanelProps>().not.toHaveProperty('className');
expectTypeOf<StatePanelProps>().not.toHaveProperty('style');
expectTypeOf<StatePanelProps>().not.toHaveProperty('loading');
expectTypeOf<{ label: string }>().not.toMatchTypeOf<StatePanelAction>();
expectTypeOf<StatePanelProps['action']>().toEqualTypeOf<
  StatePanelAction | undefined
>();

describe('StatePanel', () => {
  it('renders an empty state with app-owned copy and no action', () => {
    render(
      <BreezeProvider locale="en-GB">
        <StatePanel
          description="Create a category to organize your records."
          title="No categories yet"
          variant="empty"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('status', { name: 'No categories yet' }),
    ).toHaveAccessibleDescription(
      'Create a category to organize your records.',
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('offers one error recovery action that invokes its callback', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    render(
      <BreezeProvider locale="en-GB">
        <StatePanel
          action={{
            label: 'Try again',
            onAction: onRetry,
          }}
          description="Your records could not be loaded."
          icon="download"
          title="Records are unavailable"
          variant="error"
        />
      </BreezeProvider>,
    );

    expect(
      screen.getByRole('alert', { name: 'Records are unavailable' }),
    ).toHaveAccessibleDescription('Your records could not be loaded.');
    expect(screen.getAllByRole('button')).toHaveLength(1);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Try again' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(onRetry).toHaveBeenCalledExactlyOnceWith();
  });

  it('rejects an action descriptor without a callback at runtime', () => {
    const action = { label: 'Try again' } as unknown as StatePanelAction;

    expect(() =>
      render(
        <BreezeProvider locale="en-GB">
          <StatePanel
            action={action}
            description="Your records could not be loaded."
            title="Records are unavailable"
            variant="error"
          />
        </BreezeProvider>,
      ),
    ).toThrow(
      'StatePanel actions require a non-empty label and an onAction callback.',
    );
  });

  it('requires the Breeze provider even when no action is supplied', () => {
    expect(() =>
      render(
        <StatePanel
          description="No records are available."
          title="No records"
          variant="empty"
        />,
      ),
    ).toThrow('Breeze components must be rendered within BreezeProvider.');
  });
});
