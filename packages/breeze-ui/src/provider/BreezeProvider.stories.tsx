import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../primitives/Button/Button';
import { BreezeProvider } from './BreezeProvider';

const meta = {
  args: {
    children: <Button>Save changes</Button>,
    locale: 'en-GB',
  },
  component: BreezeProvider,
  title: 'Foundation/BreezeProvider',
} satisfies Meta<typeof BreezeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The locale and styling boundary required by every Breeze component. */
export const Default: Story = {};

/** The provider passes the application's locale into React Aria. */
export const Locale: Story = {
  args: {
    children: <Button>Enregistrer les modifications</Button>,
    locale: 'fr-FR',
  },
};
