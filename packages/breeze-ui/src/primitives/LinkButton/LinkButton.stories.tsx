import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DownloadIcon } from '../../icons';
import { Inline } from '../Inline/Inline';
import { LinkButton } from './LinkButton';

const meta = {
  component: LinkButton,
  title: 'Actions/LinkButton',
} satisfies Meta<typeof LinkButton>;
export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Presents an internal destination with primary button emphasis while
 * retaining the native href required for router-neutral navigation.
 *
 * @summary internal destination with primary button emphasis
 */
export const Internal: Story = {
  args: { children: 'Create item', href: '/new' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Create item' }),
    ).toHaveAttribute('href', '/new');
  },
};
/**
 * Compares canonical sizes, appearances, and semantic variants for
 * destinations that need different levels of visual prominence.
 *
 * @summary link-button emphasis variants across canonical sizes
 */
export const EmphasisAndSizes: Story = {
  args: { children: 'Continue', href: '/continue' },
  render: () => (
    <Inline gap="compact" wrap={false}>
      <LinkButton appearance="ghost" href="/back" size="sm" variant="secondary">
        Back
      </LinkButton>
      <LinkButton href="/continue">Continue</LinkButton>
      <LinkButton href="/remove" size="lg" variant="danger">
        Remove
      </LinkButton>
    </Inline>
  ),
};
/**
 * Uses native download navigation with a visible label and decorative icon so
 * the browser, rather than an application action callback, owns the transfer.
 *
 * @summary button-emphasized native file download destination
 */
export const Download: Story = {
  args: {
    children: (
      <>
        <DownloadIcon />
        Download template
      </>
    ),
    download: true,
    href: '/template.csv',
  },
};
