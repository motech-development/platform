import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleHelp,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Info,
  LogOut,
  type LucideIcon,
  Menu,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  Upload,
  User,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { ComponentType, SVGAttributes } from 'react';
import { createElement } from 'react';

/** Breeze-owned props shared by every curated icon. */
export interface IconProps
  extends Omit<SVGAttributes<SVGSVGElement>, 'children' | 'height' | 'width'> {
  /** Icon size in CSS pixels or a CSS length. Defaults to `1em`. */
  size?: number | string;
  /** Stroke thickness. Defaults to `2`. */
  strokeWidth?: number;
}

function createIcon(
  Icon: LucideIcon,
  displayName: string,
): ComponentType<IconProps> {
  function BreezeIcon({
    'aria-label': ariaLabel,
    className,
    size = '1em',
    strokeWidth = 2,
    style,
    ...props
  }: Readonly<IconProps>) {
    const normalizedAriaLabel = ariaLabel?.trim() || undefined;

    return createElement(Icon, {
      ...props,
      'aria-hidden': normalizedAriaLabel === undefined ? true : undefined,
      'aria-label': normalizedAriaLabel,
      className: `inline-block shrink-0 align-[-0.125em] ${className ?? ''}`,
      focusable: 'false',
      role: normalizedAriaLabel === undefined ? undefined : 'img',
      size,
      strokeWidth,
      style: {
        ...style,
        height: size,
        width: size,
      },
    });
  }

  BreezeIcon.displayName = displayName;

  return BreezeIcon;
}

/**
 * Plus icon for create or add actions.
 *
 * @summary curated create-or-add action glyph
 */
export const AddIcon = createIcon(Plus, 'AddIcon');
/** Left-pointing navigation arrow. */
export const ArrowLeftIcon = createIcon(ArrowLeft, 'ArrowLeftIcon');
/** Right-pointing navigation arrow. */
export const ArrowRightIcon = createIcon(ArrowRight, 'ArrowRightIcon');
/** Building icon for organisations and company details. */
export const BuildingIcon = createIcon(Building2, 'BuildingIcon');
/** Calendar icon for date-related interfaces. */
export const CalendarIcon = createIcon(Calendar, 'CalendarIcon');
/** Chart icon for summaries, dashboards, and analytics. */
export const ChartIcon = createIcon(ChartNoAxesCombined, 'ChartIcon');
/** Check mark for completed or selected states. */
export const CheckIcon = createIcon(Check, 'CheckIcon');
/** Down-pointing disclosure chevron. */
export const ChevronDownIcon = createIcon(ChevronDown, 'ChevronDownIcon');
/** Left-pointing disclosure chevron. */
export const ChevronLeftIcon = createIcon(ChevronLeft, 'ChevronLeftIcon');
/** Right-pointing disclosure chevron. */
export const ChevronRightIcon = createIcon(ChevronRight, 'ChevronRightIcon');
/** Up-pointing disclosure chevron. */
export const ChevronUpIcon = createIcon(ChevronUp, 'ChevronUpIcon');
/** Close or dismiss icon. */
export const CloseIcon = createIcon(X, 'CloseIcon');
/** Delete icon for destructive removal actions. */
export const DeleteIcon = createIcon(Trash2, 'DeleteIcon');
/** Download icon for obtaining a resource. */
export const DownloadIcon = createIcon(Download, 'DownloadIcon');
/** Edit icon for modifying content. */
export const EditIcon = createIcon(Pencil, 'EditIcon');
/** External-link indicator. */
export const ExternalLinkIcon = createIcon(ExternalLink, 'ExternalLinkIcon');
/** Visible-content icon. */
export const EyeIcon = createIcon(Eye, 'EyeIcon');
/** Hidden-content icon. */
export const EyeOffIcon = createIcon(EyeOff, 'EyeOffIcon');
/** Document icon for files, reports, and written records. */
export const FileTextIcon = createIcon(FileText, 'FileTextIcon');
/** Help icon for contextual assistance. */
export const HelpIcon = createIcon(CircleHelp, 'HelpIcon');
/** Information icon for neutral notices. */
export const InfoIcon = createIcon(Info, 'InfoIcon');
/** Menu icon for compact navigation. */
export const MenuIcon = createIcon(Menu, 'MenuIcon');
/** More-actions icon. */
export const MoreIcon = createIcon(Ellipsis, 'MoreIcon');
/** Paperclip icon for file attachments. */
export const PaperclipIcon = createIcon(Paperclip, 'PaperclipIcon');
/** Search icon for query interfaces. */
export const SearchIcon = createIcon(Search, 'SearchIcon');
/** Sign-out icon for ending an authenticated session. */
export const SignOutIcon = createIcon(LogOut, 'SignOutIcon');
/** Settings icon for configuration interfaces. */
export const SettingsIcon = createIcon(Settings, 'SettingsIcon');
/** Upload icon for supplying a resource. */
export const UploadIcon = createIcon(Upload, 'UploadIcon');
/** User icon for account and identity interfaces. */
export const UserIcon = createIcon(User, 'UserIcon');
/** Users icon for groups, teams, and client collections. */
export const UsersIcon = createIcon(Users, 'UsersIcon');
/** Wallet icon for money and transaction interfaces. */
export const WalletIcon = createIcon(Wallet, 'WalletIcon');
/** Warning icon for cautionary notices. */
export function WarningIcon({
  'aria-label': ariaLabel,
  className,
  size = '1em',
  strokeWidth = 2,
  style,
  ...props
}: Readonly<IconProps>) {
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;

  return createElement(
    'svg',
    {
      ...props,
      'aria-hidden': normalizedAriaLabel === undefined ? true : undefined,
      'aria-label': normalizedAriaLabel,
      className: `inline-block shrink-0 align-[-0.125em] ${className ?? ''}`,
      focusable: 'false',
      role: normalizedAriaLabel === undefined ? undefined : 'img',
      style: {
        ...style,
        height: size,
        width: size,
      },
      viewBox: '0 0 24 24',
    },
    createElement('path', {
      d: 'M12 3 22 21H2L12 3Z',
      fill: 'currentColor',
      stroke: 'none',
    }),
    createElement('path', {
      d: 'M12 9v5',
      stroke: '#fff',
      strokeWidth,
    }),
    createElement('circle', {
      cx: 12,
      cy: 17.5,
      fill: '#fff',
      r: 1,
      stroke: 'none',
    }),
  );
}
