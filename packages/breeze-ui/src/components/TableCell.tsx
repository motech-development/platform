import { FC, forwardRef, ThHTMLAttributes } from 'react';
import { Box } from 'react-polymorphic-box';
import TAlignment from '../utils/alignment';
import { classNames, textAlignmentClass } from '../utils/className';

type TTableCellAs = 'td' | 'th';

export interface ITableCellProps
  extends ThHTMLAttributes<HTMLTableDataCellElement> {
  align?: TAlignment;
  as?: TTableCellAs;
  noWrap?: boolean;
}

const TableCell: FC<ITableCellProps> = forwardRef<
  HTMLTableDataCellElement,
  ITableCellProps
>(
  (
    { align = 'left', as = 'td', className = '', noWrap = true, ...rest },
    ref,
  ) => (
    <Box
      as={as}
      className={classNames(
        'px-6 py-3',
        className,
        as === 'td' ? 'bg-white bg-opacity-70' : '',
        noWrap ? 'whitespace-nowrap' : '',
        textAlignmentClass(align),
      )}
      ref={ref}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  ),
);

export default TableCell;
