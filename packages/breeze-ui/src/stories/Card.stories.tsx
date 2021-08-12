import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import TSpacing, { Spacing } from '../utils/spacing';
import TTheme, { Theme } from '../utils/theme';

const stories = storiesOf('Card', module);

stories.addDecorator(withKnobs);

stories.add('Basic card', () => (
  <>
    <Card
      flex={boolean('Flex', false)}
      padding={select<TSpacing>('Padding', Spacing, 'md')}
      theme={select<TTheme>('Theme', Theme, 'secondary')}
    >
      {text('Text', 'Hello world')}
    </Card>
  </>
));
