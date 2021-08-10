import { FC, ReactNode } from 'react';

import useBreakpoint from '../hooks/useBreakpoint';
import Col from './Col';
import Row from './Row';

interface IMasonryItemContainerProps {
  children: ReactNode;
  gutter: string;
}

const MasonryItem: FC<IMasonryItemContainerProps> = ({ children }) => (
  <div>{children}</div>
);

const calculateCols = (cols: number) => 12 / cols;

export interface IMasonryProps {
  children: ReactNode | ReactNode[];
  gutter?: string;
  lg: number;
  md: number;
  sm: number;
  xs: number;
}

const Masonry: FC<IMasonryProps> = ({
  children,
  gutter = '1rem',
  lg,
  md,
  sm,
  xs,
}) => {
  const breakpoints = {
    lg,
    md,
    sm,
    xs,
  };
  const breakpoint = useBreakpoint();
  const columns = breakpoints[breakpoint];
  const cols: ReactNode[][] = Array.from(new Array(columns), () => []);
  const flat = Array.isArray(children) ? children.flat() : [children];

  flat.forEach((child, i) => {
    const colIndex = i % columns;

    cols[colIndex].push(
      // eslint-disable-next-line react/no-array-index-key
      <MasonryItem key={i} gutter={gutter}>
        {child}
      </MasonryItem>,
    );
  });

  return (
    <Row gutter={gutter}>
      {cols.map((_, i) => (
        <Col
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          xs={calculateCols(xs)}
          sm={calculateCols(sm)}
          md={calculateCols(md)}
          lg={calculateCols(lg)}
        >
          {cols[i]}
        </Col>
      ))}
    </Row>
  );
};

export default Masonry;
