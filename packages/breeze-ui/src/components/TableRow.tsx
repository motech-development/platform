import { FC, forwardRef, TableHTMLAttributes } from 'react';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

export interface ITableRowProps
  extends TableHTMLAttributes<HTMLTableRowElement> {
  colour?: TTheme;
}

const TableRow: FC<ITableRowProps> = forwardRef<
  HTMLTableRowElement,
  ITableRowProps
>(({ className = '', colour = 'secondary', ...rest }, ref) => (
  <>
    {/* @tailwind: bg-blue-700 bg-gray-100 bg-green-700 bg-red-700 bg-yellow-700 */}
    {/* @tailwind: border-blue-800 border-gray-200 border-green-800 border-red-800 border-yellow-800 */}
    {/* @tailwind: text-blue-100 text-gray-700 text-green-100 text-red-100 text-yellow-100 */}
    <tr
      className={classNames(
        'border-b-2',
        className,
        themeClass(
          colour,
          'bg-{theme}-700 border-{theme}-800 text-{theme}-100',
          {
            secondary: 'bg-{theme}-100 border-{theme}-200 text-{theme}-700',
          },
        ),
      )}
      ref={ref}
      {...rest}
    />
  </>
));

export default TableRow;
