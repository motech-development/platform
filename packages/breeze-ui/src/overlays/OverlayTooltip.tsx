import type { ReactNode } from 'react';
import {
  Tooltip as AriaTooltip,
  TooltipTrigger as AriaTooltipTrigger,
} from 'react-aria-components/Tooltip';
import { useOverlayToastZIndex } from './OverlayStack';

const variants = {
  base: {
    tooltip:
      'breeze:max-inline-[240px] breeze:rounded-breeze-ctl breeze:bg-breeze-avatar breeze:px-breeze-2 breeze:py-breeze-1 breeze:font-breeze-sans breeze:text-breeze-xs breeze:text-breeze-on-avatar breeze:shadow-breeze-overlay',
  },
  compound: {},
  size: {},
  state: {},
  variant: {},
} as const;

/** Explains a focusable trigger on hover and keyboard focus. */
export default function OverlayTooltip({
  children,
  tooltip,
}: Readonly<{ children: ReactNode; tooltip: string }>) {
  const zIndex = useOverlayToastZIndex();

  return (
    <AriaTooltipTrigger delay={500}>
      {children}
      <AriaTooltip
        className={variants.base.tooltip}
        offset={6}
        style={{ zIndex }}
      >
        {tooltip}
      </AriaTooltip>
    </AriaTooltipTrigger>
  );
}
