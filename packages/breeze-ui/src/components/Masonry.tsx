import { FC, ReactNode } from 'react';
import useBreakpoint from '../hooks/useBreakpoint';
import { TColumn, TGap } from '../utils/grid';
import Col from './Col';
import Row from './Row';

const calculateCols = (cols: number) => Math.round(12 / cols) as TColumn;

export interface IMasonryProps {
  children: ReactNode | ReactNode[];
  gutter?: TGap;
  lg: TColumn;
  md: TColumn;
  sm: TColumn;
  xs: TColumn;
}

const Masonry: FC<IMasonryProps> = ({
  children,
  gutter = 0,
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
      // @tailwind: mb-0 mb-1 mb-2 mb-3 mb-4 mb-5
      // eslint-disable-next-line react/no-array-index-key
      <div className={`mb-${gutter}`} key={i}>
        {child}
      </div>,
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
