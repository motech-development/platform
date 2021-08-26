import { FC, ReactNode } from 'react';
import TAlignment from '../utils/alignment';
import { classNames, textAlignmentClass } from '../utils/className';
import { TColumn } from '../utils/grid';

export interface IColProps {
  children: ReactNode;
  align?: TAlignment;
  lg?: TColumn;
  lgOffset?: TColumn;
  md?: TColumn;
  mdOffset?: TColumn;
  sm?: TColumn;
  smOffset?: TColumn;
  verticalAlign?: boolean;
  xs?: TColumn;
  xsOffset?: TColumn;
}

const colClasses = (size: string, cols: number, offset: number) => {
  if (cols > 0) {
    if (offset > 0) {
      return `${size}:col-start-${offset} ${size}:col-span-${cols}`;
    }

    return `${size}:col-span-${cols}`;
  }

  return '';
};

const Col: FC<IColProps> = ({
  children,
  align = 'left',
  lg = 0,
  lgOffset = 0,
  md = 0,
  mdOffset = 0,
  sm = 0,
  smOffset = 0,
  verticalAlign = false,
  xs = 12,
  xsOffset = 0,
}) => (
  <>
    {/* @tailwind: col-start-1 col-start-2 col-start-3 col-start-4 col-start-5 col-start-6 col-start-7 col-start-8 col-start-9 col-start-10 col-start-11 col-start-12 */}
    {/* @tailwind: col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12 */}
    {/* @tailwind: sm:col-start-1 sm:col-start-2 sm:col-start-3 sm:col-start-4 sm:col-start-5 sm:col-start-6 sm:col-start-7 sm:col-start-8 sm:col-start-9 sm:col-start-10 sm:col-start-11 sm:col-start-12 */}
    {/* @tailwind: sm:col-span-1 sm:col-span-2 sm:col-span-3 sm:col-span-4 sm:col-span-5 sm:col-span-6 sm:col-span-7 sm:col-span-8 sm:col-span-9 sm:col-span-10 sm:col-span-11 sm:col-span-12 */}
    {/* @tailwind: md:col-start-1 md:col-start-2 md:col-start-3 md:col-start-4 md:col-start-5 md:col-start-6 md:col-start-7 md:col-start-8 md:col-start-9 md:col-start-10 md:col-start-11 md:col-start-12 */}
    {/* @tailwind: md:col-span-1 md:col-span-2 md:col-span-3 md:col-span-4 md:col-span-5 md:col-span-6 md:col-span-7 md:col-span-8 md:col-span-9 md:col-span-10 md:col-span-11 md:col-span-12 */}
    {/* @tailwind: lg:col-start-1 lg:col-start-2 lg:col-start-3 lg:col-start-4 lg:col-start-5 lg:col-start-6 lg:col-start-7 lg:col-start-8 lg:col-start-9 lg:col-start-10 lg:col-start-11 lg:col-start-12 */}
    {/* @tailwind: lg:col-span-1 lg:col-span-2 lg:col-span-3 lg:col-span-4 lg:col-span-5 lg:col-span-6 lg:col-span-7 lg:col-span-8 lg:col-span-9 lg:col-span-10 lg:col-span-11 lg:col-span-12 */}
    <div
      className={classNames(
        'relative',
        textAlignmentClass(align),
        verticalAlign ? 'flex items-center' : '',
        xsOffset > 0
          ? `col-start-${xsOffset} col-span-${xs}`
          : `col-span-${xs}`,
        colClasses('sm', sm, smOffset),
        colClasses('md', md, mdOffset),
        colClasses('lg', lg, lgOffset),
      )}
    >
      <div className={classNames(verticalAlign ? 'flex-1' : '')}>
        {children}
      </div>
    </div>
  </>
);

export default Col;
