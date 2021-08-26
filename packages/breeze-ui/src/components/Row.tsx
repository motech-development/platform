import { FC, ReactNode } from 'react';
import { TColumn, TGap } from '../utils/grid';

export interface IRowProps {
  children: ReactNode;
  columns?: TColumn;
  gutter?: TGap;
}

const Row: FC<IRowProps> = ({ children, columns = 12, gutter = 0 }) => (
  <>
    {/* @tailwind: grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12 */}
    {/* @tailwind: gap-0 gap-1 gap-2 gap-3 gap-4 gap-5 */}
    <div className={`grid grid-cols-${columns} gap-${gutter}`}>{children}</div>
  </>
);

export default Row;
