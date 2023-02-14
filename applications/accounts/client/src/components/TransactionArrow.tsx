import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TableCell } from '@motech-development/breeze-ui';
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

const TransactionArrowCell = styled(TableCell)`
  max-width: 70px;
  min-width: 70px;
  width: 70px;
`;

interface ITransactionArrowProps {
  value: number;
}

function TransactionArrow({ value }: ITransactionArrowProps) {
  const isNegative = value < 0;
  const icon = isNegative ? faArrowLeft : faArrowRight;
  const theme = isNegative ? danger : success;

  return (
    <ThemeProvider theme={theme}>
      <TransactionArrowCell align="center">
        <Arrow icon={icon} />
      </TransactionArrowCell>
    </ThemeProvider>
  );
}

export default TransactionArrow;
