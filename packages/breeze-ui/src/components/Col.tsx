import { FC, ReactNode } from 'react';

export interface IColProps {
  children: ReactNode;
  align?: 'centre' | 'left' | 'right';
  lg?: number;
  lgOffset?: number;
  md?: number;
  mdOffset?: number;
  sm?: number;
  smOffset?: number;
  verticalAlign?: 'middle';
  xs?: number;
  xsOffset?: number;
}

// {
//   children,
//   align = 'left',
//   lg = 0,
//   lgOffset = 0,
//   md = 0,
//   mdOffset = 0,
//   sm = 0,
//   smOffset = 0,
//   verticalAlign = null,
//   xs = 12,
//   xsOffset = 0,
// }
const Col: FC<IColProps> = () => <div />;

export default Col;
