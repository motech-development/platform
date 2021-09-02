import { forwardRef, TableHTMLAttributes } from 'react';
import { classNames } from '../utils/className';

export type TTableBodyProps = TableHTMLAttributes<HTMLTableSectionElement>;

const TableBody = forwardRef<HTMLTableSectionElement, TTableBodyProps>(
  ({ className = '', ...rest }, ref) => (
    <tbody
      className={classNames('font-sans text-sm', className)}
      ref={ref}
      {...rest}
    />
  ),
);

export default TableBody;
