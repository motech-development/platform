import { text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import ButtonLink from './ButtonLink';

export default {
  component: ButtonLink,
  decorators: [withKnobs],
};

export const BasicButtonLink = {
  name: 'Basic button link',
  render: () => (
    <>
      <BaseStyles />

      <Card>
        <ButtonLink>{text('Text', 'This is a button')}</ButtonLink>
      </Card>
    </>
  ),
};
