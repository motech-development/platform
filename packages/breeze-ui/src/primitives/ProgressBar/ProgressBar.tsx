import { ProgressBar as AriaProgressBar } from 'react-aria-components/ProgressBar';
import { useBreezeContext } from '../../provider/BreezeContext';

const variants = {
  base: {
    fill: 'breeze:block breeze:block-full breeze:bg-breeze-brand',
    progress:
      'breeze:flex breeze:min-inline-0 breeze:flex-col breeze:gap-breeze-2',
    track:
      'breeze:block-[6px] breeze:overflow-hidden breeze:rounded-breeze-full breeze:bg-breeze-sunken',
    valueLabel:
      'breeze:min-inline-0 breeze:truncate breeze:font-breeze-sans breeze:text-breeze-xs breeze:font-semibold breeze:text-breeze-ink-3',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

export interface ProgressBarProps {
  /** Names the progress for assistive technology. */
  'aria-label': string;
  /** The total that `value` counts towards. Defaults to `100`. */
  maxValue?: number;
  /** The amount of progress, from `0` to `maxValue`. */
  value: number;
  /** Visible text describing the progress, also announced in place of a percentage. */
  valueLabel: string;
}

/**
 * Shows how far a task has progressed towards a known total.
 *
 * @summary A labelled determinate progress bar.
 */
export function ProgressBar({
  'aria-label': ariaLabel,
  maxValue = 100,
  value,
  valueLabel,
}: Readonly<ProgressBarProps>) {
  useBreezeContext();

  return (
    <AriaProgressBar
      aria-label={ariaLabel}
      className={variants.base.progress}
      maxValue={maxValue}
      value={value}
      valueLabel={valueLabel}
    >
      {({ percentage }) => (
        <>
          <span className={variants.base.valueLabel}>{valueLabel}</span>
          <span aria-hidden="true" className={variants.base.track}>
            <span
              className={variants.base.fill}
              style={{
                inlineSize: `${Number.isFinite(percentage) ? percentage : 0}%`,
              }}
            />
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}
