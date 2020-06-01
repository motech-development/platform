import React, { FC, HTMLAttributes, memo } from 'react';
import { darken } from 'polished';
import styled, { ThemeProvider } from 'styled-components';

const tableRowTheme = {
  default: {
    background: '#fff',
    border: '#eee',
    colour: '#000',
  },
  primary: {
    background: '#007fa8',
    border: darken(0.02, '#007fa8'),
    colour: '#fff',
  },
  secondary: {
    background: '#f6f9fc',
    border: '#eee',
    colour: '#333',
  },
};

interface IBaseTableRow {
  $colour: keyof typeof tableRowTheme;
}

const BaseTableRow = styled.tr<IBaseTableRow>`
  ${({ $colour, theme }) => `
    background-color: ${theme[$colour].background};
    border-bottom: 2px solid ${theme[$colour].border};
    color: ${theme[$colour].colour};
  `}
`;

export interface ITableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  colour?: keyof typeof tableRowTheme;
}

const TableRow: FC<ITableRowProps> = ({ colour = 'default', ...rest }) => (
  <ThemeProvider theme={tableRowTheme}>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <BaseTableRow $colour={colour} {...rest} />
  </ThemeProvider>
);

export default memo(TableRow);
