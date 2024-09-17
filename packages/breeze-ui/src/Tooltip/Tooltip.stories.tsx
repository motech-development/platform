import { select, text, withKnobs } from '@storybook/addon-knobs';
import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Tooltip from './Tooltip';

export default {
  component: Tooltip,
  decorators: [withKnobs],
};

const colour = {
  Danger: 'danger',
  Primary: 'primary',
  Secondary: 'secondary',
  Success: 'success',
};
const placement = {
  Bottom: 'bottom',
  Left: 'left',
  Right: 'right',
  Top: 'top',
};

export const BasicTooltip = {
  name: 'Basic tooltip',
  render: () => (
    <>
      <BaseStyles />

      <Tooltip
        id="test"
        parent={
          <Button colour="primary" size="lg">
            Hover over me
          </Button>
        }
        placement={
          select('Placement', placement, 'bottom') as
            | 'bottom'
            | 'left'
            | 'right'
            | 'top'
        }
        colour={
          select('Colour', colour, 'primary') as
            | 'danger'
            | 'primary'
            | 'secondary'
            | 'success'
        }
        message={text('Text', 'This is a tooltip!')}
      />
    </>
  ),
};
