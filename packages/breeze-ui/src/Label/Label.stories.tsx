import BaseStyles from '../BaseStyles/BaseStyles';
import Label from './Label';

const labelContainerStyle = {
  background: '#fff',
  borderBottom: '2px solid #eee',
  height: '64px',
  marginBottom: '20px',
  padding: '0 8px',
  position: 'relative',
  width: '320px',
} as const;

export default {
  component: Label,
};

export const TransitionStates = {
  name: 'Transition states',
  render: () => (
    <>
      <BaseStyles />

      <div style={{ padding: '24px' }}>
        <div data-testid="label-rest" style={labelContainerStyle}>
          <Label active={false} error={false} htmlFor="label-rest-input">
            Resting label
          </Label>
        </div>

        <div data-testid="label-focused" style={labelContainerStyle}>
          <Label active error={false} htmlFor="label-focused-input">
            Focused label
          </Label>
        </div>
      </div>
    </>
  ),
};
