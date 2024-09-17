import { text, withKnobs } from '@storybook/addon-knobs';
import { MemoryRouter } from 'react-router-dom';
import BaseStyles from '../BaseStyles/BaseStyles';
import Card from '../Card/Card';
import Link from './Link';

export default {
  component: Link,
  decorators: [withKnobs],
};

export const BasicLink = {
  name: 'Basic link',
  render: () => (
    <MemoryRouter>
      <BaseStyles />

      <Card>
        <Link to={text('To', '/home')}>{text('Text', 'This is a link')}</Link>
      </Card>
    </MemoryRouter>
  ),
};
