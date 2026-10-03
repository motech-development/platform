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
    '2xl': 'breeze:block-[22px] breeze:inline-[22px]',
    '2xs': 'breeze:block-[14px] breeze:inline-[14px]',
    '3xl': 'breeze:block-breeze-6 breeze:inline-breeze-6',
    '4xl': 'breeze:block-[26px] breeze:inline-[26px]',
    lg: 'breeze:block-breeze-5 breeze:inline-breeze-5',
    md: 'breeze:block-[17px] breeze:inline-[17px]',
    sm: 'breeze:block-breeze-4 breeze:inline-breeze-4',
    xl: 'breeze:block-[21px] breeze:inline-[21px]',
    xs: 'breeze:block-[15px] breeze:inline-[15px]',
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
  /** Selects dimensions from `2xs` (14px) to `4xl` (26px). Defaults to `sm` (16px). */
  size?: IconSize;
}

/**
 * Renders one curated Lucide glyph under Breeze's semantic artwork names.
 *
 * @summary The single dependency boundary for Breeze icon artwork.
 */
export function Icon({ label, name, size = 'sm' }: Readonly<IconProps>) {
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
