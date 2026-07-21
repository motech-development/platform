import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationList } from '../../primitives/NavigationList/NavigationList';
import { NavigationSection } from './NavigationSection';

/**
 * Groups related router-neutral destinations beneath one persistent visible
 * heading and uses it to name the navigation landmark.
 *
 * @summary labelled navigation landmark for related destinations
 */
const meta = {
  component: NavigationSection,
  title: 'Patterns/Navigation/NavigationSection',
} satisfies Meta<typeof NavigationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Groups a current destination and a peer destination below a persistent
 * heading while leaving link targets and current-route state application-owned.
 *
 * @summary titled navigation landmark containing router-neutral destinations
 */
export const Destinations: Story = {
  args: {
    children: (
      <NavigationList.Root aria-label="Project destinations">
        <NavigationList.Item current href="/overview" id="overview">
          Overview
        </NavigationList.Item>
        <NavigationList.Item href="/projects" id="projects">
          Projects
        </NavigationList.Item>
      </NavigationList.Root>
    ),
    title: 'Projects',
  },
};
