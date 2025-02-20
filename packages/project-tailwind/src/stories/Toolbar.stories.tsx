import { Meta, StoryFn } from '@storybook/react';
import { Logo } from '../components/Logo';
import { Toolbar } from '../components/Toolbar';
import { Typography } from '../components/Typography';

export default {
  args: {
    as: 'nav',
  },
  component: Toolbar,
} as Meta<typeof Toolbar>;

export const BasicToolbar: StoryFn<typeof Toolbar> = (props) => (
  <Toolbar {...props}>
    <div className="flex-shrink-0">
      <Typography as="h1" variant="h5" margin="none">
        Motech Development
      </Typography>
    </div>
  </Toolbar>
);

export const AdvancedToolbar: StoryFn<typeof Toolbar> = (props) => (
  <Toolbar {...props}>
    <div className="flex-shrink-0">
      <Logo className="h-10 w-10" alt="logo" />
    </div>

    {/* TODO: Add notifications */}
  </Toolbar>
);
