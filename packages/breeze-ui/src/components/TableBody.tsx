import { FC, HTMLProps } from 'react';
import { classNames } from '../utils/className';

export type TTableBodyProps = HTMLProps<HTMLTableSectionElement>;

const TableBody: FC<TTableBodyProps> = ({ className = '', ...rest }) => (
  <tbody className={classNames('font-sans text-sm', className)} {...rest} />
);

export default TableBody;
