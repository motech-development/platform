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
  lock: LockKeyhole,
  money: ListIcon,
  moneyIn: ArrowDownLeft,
  moneyOut: ArrowUpRight,
  more: Ellipsis,
  next: ChevronRight,
  notifications: Bell,
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
    lg: 'breeze:block-size-breeze-6 breeze:inline-size-breeze-6',
    md: 'breeze:block-size-breeze-5 breeze:inline-size-breeze-5',
    sm: 'breeze:block-size-breeze-4 breeze:inline-size-breeze-4',
  },
  state: {
    logicalDirection: 'breeze:rtl:rotate-180',
  },
  variant: {},
} as const;

const logicalDirectionIcons = new Set<IconName>(['back', 'forward', 'next']);

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
