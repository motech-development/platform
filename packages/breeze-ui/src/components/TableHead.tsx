import { FC, forwardRef, TableHTMLAttributes } from 'react';
import { classNames } from '../utils/className';

export type TTableHeadProps = TableHTMLAttributes<HTMLTableSectionElement>;

const TableHead: FC<TTableHeadProps> = forwardRef<
  HTMLTableSectionElement,
  TTableHeadProps
>(({ className = '', ...rest }, ref) => (
  <thead
    className={classNames('font-display font-semibold', className)}
    ref={ref}
    {...rest}
  />
));

export default TableHead;
