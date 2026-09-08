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

/** A provider with the application's locale. */
export const Default: Story = {};

/** A French locale applied to the components below the provider. */
export const Locale: Story = {
  args: {
    children: <Button>Enregistrer les modifications</Button>,
    locale: 'fr-FR',
  },
};
