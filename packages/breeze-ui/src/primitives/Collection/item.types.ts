import type { BadgeProps } from '../Badge/Badge';
import type { IconName } from '../Icon/Icon';

/** The data contract used to render a compact status badge in a collection item. */
export type ItemDescriptorBadge = Pick<
  BadgeProps,
  'aria-label' | 'children' | 'variant'
>;

/**
 * The closed data contract for content rendered by Breeze collection controls.
 * Unsupported content requires a deliberate library change rather than a
 * render or markup escape hatch.
 */
export interface ItemDescriptor {
  badge?: ItemDescriptorBadge;
  description?: string;
  disabled?: boolean;
  icon?: IconName;
  id: string;
  label: string;
}
