import { FC, HTMLProps } from 'react';
import { classNames } from '../utils/className';

export type TTableHeadProps = HTMLProps<HTMLTableSectionElement>;

const TableHead: FC<TTableHeadProps> = ({ className = '', ...rest }) => (
  <thead
    className={classNames('font-display font-semibold', className)}
    {...rest}
  />
);

export default TableHead;
