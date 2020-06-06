import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ITypographyProps,
  Tooltip,
  Typography,
} from '@motech-development/breeze-ui';
import React, { FC, memo } from 'react';
import styled from 'styled-components';

interface IArrow {
  $placement: 'left' | 'right';
}

const Arrow = styled(FontAwesomeIcon)<IArrow>`
  ${({ $placement }) => `
    color: rgb(199,56,79);
    margin: 0 ${$placement === 'left' ? '0.5rem 0 0' : '0 0 0.5rem'};
  `}
`;

export interface IWarningProps extends ITypographyProps {
  id: string;
  message: string;
  placement: 'left' | 'right';
  show: boolean;
}

const Warning: FC<IWarningProps> = ({
  children,
  id,
  message,
  placement,
  show,
  ...rest
}) => {
  if (show) {
    return (
      <Tooltip
        colour="danger"
        id={id}
        message={message}
        parent={
          <>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Typography {...rest}>
              {placement === 'left' && (
                <Arrow icon={faExclamationTriangle} $placement={placement} />
              )}

              {children}

              {placement === 'right' && (
                <Arrow icon={faExclamationTriangle} $placement={placement} />
              )}
            </Typography>
          </>
        }
        placement={placement}
      />
    );
  }

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Typography {...rest}>{children}</Typography>
  );
};

export default memo(Warning);
