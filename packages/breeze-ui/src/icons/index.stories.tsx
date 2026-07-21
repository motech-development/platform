import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from '../primitives/Grid/Grid';
import { Inline } from '../primitives/Inline/Inline';
import { Typography } from '../primitives/Typography/Typography';
import {
  AddIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BuildingIcon,
  CalendarIcon,
  ChartIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CloseIcon,
  DeleteIcon,
  DownloadIcon,
  EditIcon,
  ExternalLinkIcon,
  EyeIcon,
  EyeOffIcon,
  FileTextIcon,
  HelpIcon,
  InfoIcon,
  MenuIcon,
  MoreIcon,
  PaperclipIcon,
  SearchIcon,
  SettingsIcon,
  SignOutIcon,
  UploadIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  WarningIcon,
} from './index';

const icons = [
  { Icon: AddIcon, name: 'AddIcon' },
  { Icon: ArrowLeftIcon, name: 'ArrowLeftIcon' },
  { Icon: ArrowRightIcon, name: 'ArrowRightIcon' },
  { Icon: BuildingIcon, name: 'BuildingIcon' },
  { Icon: CalendarIcon, name: 'CalendarIcon' },
  { Icon: ChartIcon, name: 'ChartIcon' },
  { Icon: CheckIcon, name: 'CheckIcon' },
  { Icon: ChevronDownIcon, name: 'ChevronDownIcon' },
  { Icon: ChevronLeftIcon, name: 'ChevronLeftIcon' },
  { Icon: ChevronRightIcon, name: 'ChevronRightIcon' },
  { Icon: ChevronUpIcon, name: 'ChevronUpIcon' },
  { Icon: CloseIcon, name: 'CloseIcon' },
  { Icon: DeleteIcon, name: 'DeleteIcon' },
  { Icon: DownloadIcon, name: 'DownloadIcon' },
  { Icon: EditIcon, name: 'EditIcon' },
  { Icon: ExternalLinkIcon, name: 'ExternalLinkIcon' },
  { Icon: EyeIcon, name: 'EyeIcon' },
  { Icon: EyeOffIcon, name: 'EyeOffIcon' },
  { Icon: FileTextIcon, name: 'FileTextIcon' },
  { Icon: HelpIcon, name: 'HelpIcon' },
  { Icon: InfoIcon, name: 'InfoIcon' },
  { Icon: MenuIcon, name: 'MenuIcon' },
  { Icon: MoreIcon, name: 'MoreIcon' },
  { Icon: PaperclipIcon, name: 'PaperclipIcon' },
  { Icon: SearchIcon, name: 'SearchIcon' },
  { Icon: SettingsIcon, name: 'SettingsIcon' },
  { Icon: SignOutIcon, name: 'SignOutIcon' },
  { Icon: UploadIcon, name: 'UploadIcon' },
  { Icon: UserIcon, name: 'UserIcon' },
  { Icon: UsersIcon, name: 'UsersIcon' },
  { Icon: WalletIcon, name: 'WalletIcon' },
  { Icon: WarningIcon, name: 'WarningIcon' },
] as const;

const meta = {
  component: AddIcon,
  title: 'Foundation/Icons',
} satisfies Meta<typeof AddIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Use the catalogue to choose the closest semantic glyph, then import only
 * that named icon from `@motech-development/breeze-ui/icons`.
 *
 * @summary for selecting and importing a curated icon by its exact name
 */
export const Catalogue: Story = {
  render: () => (
    <Grid columns={{ base: 2, sm: 4 }} gap="md">
      {icons.map(({ Icon, name }) => (
        <Inline gap="sm" key={name} wrap={false}>
          <Icon size={24} />
          <Typography as="span">{name}</Typography>
        </Inline>
      ))}
    </Grid>
  ),
};

/**
 * Add an accessible label only when the glyph itself communicates information.
 * Icons next to visible text stay decorative and hidden from assistive
 * technology by default.
 *
 * @summary for an icon that is the only source of its accessible meaning
 */
export const MeaningfulIcon: Story = {
  render: () => <InfoIcon aria-label="Information" size={24} />,
};
