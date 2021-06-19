import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DateTime,
  IDateTimeProps,
  Tooltip,
} from '@motech-development/breeze-ui';
import { FC } from 'react';
import styled from 'styled-components';

interface IClock {
  $placement: 'left' | 'right';
}

const Clock = styled(FontAwesomeIcon)<IClock>`
  ${({ $placement }) => `
    color: #007fa8;
    cursor: pointer;
    margin: 0 ${$placement === 'left' ? '0.5rem 0 0' : '0 0 0.5rem'};
  `}
`;

export interface IScheduledProps extends IDateTimeProps {
  id: string;
  message: string;
  placement: 'left' | 'right';
  show: boolean;
}

const Scheduled: FC<IScheduledProps> = ({
  format,
  id,
  message,
  placement,
  show,
  value,
}) => {
  if (show) {
    return (
      <Tooltip
        colour="primary"
        id={id}
        message={message}
        parent={
          <>
            {placement === 'left' && (
              <Clock icon={faClock} $placement={placement} />
            )}

            <DateTime format={format} value={value} />

            {placement === 'right' && (
              <Clock icon={faClock} $placement={placement} />
            )}
          </>
        }
        placement={placement}
      />
    );
  }

  return <DateTime format={format} value={value} />;
};

export default Scheduled;
