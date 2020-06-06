import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { FC, memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';

const danger = {
  colour: 'rgb(199,56,79)',
};

const success = {
  colour: 'rgb(0,128,93)',
};

const Arrow = styled(FontAwesomeIcon)`
  ${({ theme }) => `
    color: ${theme.colour};
  `}
`;

interface ITransactionArrowProps {
  value: number;
}

const TransactionArrow: FC<ITransactionArrowProps> = ({ value }) => {
  const isNegative = value < 0;
  const icon = isNegative ? faArrowLeft : faArrowRight;
  const theme = isNegative ? danger : success;

  return (
    <ThemeProvider theme={theme}>
      <Arrow icon={icon} />
    </ThemeProvider>
  );
};

export default memo(TransactionArrow);
