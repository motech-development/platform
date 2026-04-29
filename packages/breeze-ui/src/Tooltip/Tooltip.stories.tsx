import BaseStyles from '../BaseStyles/BaseStyles';
import Button from '../Button/Button';
import Tooltip from './Tooltip';

export default {
  component: Tooltip,
};

type TooltipColour = 'danger' | 'primary' | 'secondary' | 'success';
type TooltipPlacement = 'bottom' | 'left' | 'right' | 'top';

interface TooltipFixtureArgs {
  colour: TooltipColour;
  message: string;
  placement: TooltipPlacement;
}

const defaultArgs = {
  colour: 'primary',
  message: 'This is a tooltip!',
} as const;

const renderTooltip = ({ colour, message, placement }: TooltipFixtureArgs) => (
  <>
    <BaseStyles />

    <div
      data-testid="tooltip-baseline"
      style={{ height: '320px', padding: '128px', width: '480px' }}
    >
      <Tooltip
        id="test"
        parent={
          <Button colour="primary" size="lg">
            Hover over me
          </Button>
        }
        placement={placement}
        colour={colour}
        message={message}
      />
    </div>
  </>
);

export const BasicTooltip = {
  name: 'Basic tooltip',
  render: () =>
    renderTooltip({
      ...defaultArgs,
      placement: 'bottom',
    }),
};

export const BottomTooltip = {
  name: 'Bottom tooltip',
  render: () =>
    renderTooltip({
      ...defaultArgs,
      placement: 'bottom',
    }),
};

export const LeftTooltip = {
  name: 'Left tooltip',
  render: () =>
    renderTooltip({
      ...defaultArgs,
      placement: 'left',
    }),
};

export const RightTooltip = {
  name: 'Right tooltip',
  render: () =>
    renderTooltip({
      ...defaultArgs,
      placement: 'right',
    }),
};

export const TopTooltip = {
  name: 'Top tooltip',
  render: () =>
    renderTooltip({
      ...defaultArgs,
      placement: 'top',
    }),
};
