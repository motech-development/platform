import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from '../../primitives/TextField/TextField';
import { FormSection } from './FormSection';

const meta = {
  args: {
    children: (
      <TextField
        description="Used for account correspondence."
        label="Email address"
        type="email"
      />
    ),
    description: 'Used for account correspondence.',
    title: 'Contact details',
  },
  component: FormSection,
  title: 'Forms/FormSection',
} satisfies Meta<typeof FormSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A native fieldset with an accessible legend and supporting description. */
export const Default: Story = {};

/** Independent groups keep longer forms organized and labelled. */
export const MultipleSections: Story = {
  render: () => (
    <div className="breeze-story-stack">
      <FormSection
        description="Used for account correspondence."
        title="Contact details"
      >
        <TextField label="Email address" type="email" />
      </FormSection>
      <FormSection
        description="Where invoices should be sent."
        title="Billing details"
      >
        <TextField label="Billing email address" type="email" />
      </FormSection>
    </div>
  ),
};
