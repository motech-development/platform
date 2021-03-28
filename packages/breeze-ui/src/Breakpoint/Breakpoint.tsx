import { FC, ReactNode } from 'react';
import useBreakpoint from '../hooks/useBreakpoint';

export interface IBreakpoint {
  children: ReactNode;
  lg?: boolean;
  md?: boolean;
  sm?: boolean;
  xs?: boolean;
}

const Breakpoint: FC<IBreakpoint> = ({
  children,
  lg = true,
  md = true,
  sm = true,
  xs = true,
}) => {
  const breakpoint = useBreakpoint();
  const matrix = {
    lg,
    md,
    sm,
    xs,
  };

  if (matrix[breakpoint]) {
    return <>{children}</>;
  }

  return null;
};

export default Breakpoint;
