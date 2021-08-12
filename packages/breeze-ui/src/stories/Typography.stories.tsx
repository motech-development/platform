import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import Card from '../components/Card';
import Typography, {
  TTypographyComponent,
  TTypographyVariant,
  TypographyComponent,
  TypographyVariant,
} from '../components/Typography';
import TAlignment, { Alignment } from '../utils/alignment';
import TSpacing, { Spacing } from '../utils/spacing';

const stories = storiesOf('Typography', module);

stories.addDecorator(withKnobs);

stories.add('Basic typography', () => (
  <>
    <Card>
      <Typography
        align={
          select<TAlignment>('Alignment', Alignment, 'left') as
            | 'left'
            | 'right'
            | 'center'
        }
        component={select<TTypographyComponent>(
          'Component',
          TypographyComponent,
          'h1',
        )}
        variant={select<TTypographyVariant>('Variant', TypographyVariant, 'h1')}
        margin={select<TSpacing>('Margin', Spacing, 'md')}
        rule={boolean('Horizontal rule', false)}
      >
        {text('Text', 'Hello world')}
      </Typography>
    </Card>
  </>
));
