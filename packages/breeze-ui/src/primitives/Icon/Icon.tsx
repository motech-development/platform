import {
  ArrowDownLeft,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Ellipsis,
  FileText,
  House,
  List as ListIcon,
  LockKeyhole,
  LogOut,
  type LucideIcon,
  Plus,
  Settings,
  Trash2,
  TriangleAlert,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useBreezeContext } from '../../provider/BreezeContext';

const artwork = {
  add: Plus,
  back: ChevronLeft,
  building: Building2,
  calendar: CalendarDays,
  camera: Camera,
  check: Check,
  clock: Clock3,
  close: X,
  delete: Trash2,
  document: FileText,
  download: Download,
  expand: ChevronDown,
  forward: ChevronRight,
  incoming: ArrowDownLeft,
  list: ListIcon,
  lock: LockKeyhole,
  more: Ellipsis,
  notifications: Bell,
  outgoing: ArrowUpRight,
  overview: House,
  people: Users,
  settings: Settings,
  signOut: LogOut,
  upload: Upload,
  warning: TriangleAlert,
} satisfies Record<string, LucideIcon>;

const variants = {
  base: {
    icon: 'breeze:block breeze:shrink-0',
  },
  compound: {},
  size: {
    lg: 'breeze:block-breeze-6 breeze:inline-breeze-6',
    md: 'breeze:block-breeze-5 breeze:inline-breeze-5',
    sm: 'breeze:block-breeze-4 breeze:inline-breeze-4',
  },
  state: {
    logicalDirection: 'breeze:rtl:rotate-180',
  },
  variant: {},
} as const;

const logicalDirectionIcons = new Set<IconName>(['back', 'forward']);

export type IconName = keyof typeof artwork;
export type IconSize = keyof typeof variants.size;

export interface IconProps {
  /** Names meaningful artwork; omit for an icon already described by nearby text. */
  label?: string;
  /** Selects artwork from the curated Breeze icon set. */
  name: IconName;
  /** Selects `sm`, `md`, or `lg` dimensions. Defaults to `md`. */
  size?: IconSize;
}

/**
 * Renders one curated Lucide glyph under Breeze's semantic artwork names.
 *
 * @summary The single dependency boundary for Breeze icon artwork.
 */
export function Icon({ label, name, size = 'md' }: Readonly<IconProps>) {
  useBreezeContext();

  const Artwork = artwork[name];
  const accessibleLabel = label?.trim() || undefined;

  return (
    <Artwork
      aria-hidden={accessibleLabel === undefined ? true : undefined}
      aria-label={accessibleLabel}
      className={[
        variants.base.icon,
        variants.size[size],
        logicalDirectionIcons.has(name) && variants.state.logicalDirection,
      ]
        .filter(Boolean)
        .join(' ')}
      focusable="false"
      role={accessibleLabel === undefined ? undefined : 'img'}
      strokeWidth={1.75}
    />
  );
}
