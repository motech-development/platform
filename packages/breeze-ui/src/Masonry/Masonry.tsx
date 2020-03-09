import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
import Col from '../Col/Col';
import Row from '../Row/Row';

interface IMasonryItemContainerProps {
  gutter: string;
}

const MasonryItem = styled.div<IMasonryItemContainerProps>`
  ${({ gutter }) => `
    margin-bottom: ${gutter};
  `}
`;

const getBreakpoint = () => {
  const lg = window.matchMedia('(min-width: 992px)');
  const md = window.matchMedia('(min-width: 768px)');
  const sm = window.matchMedia('(min-width: 576px)');

  if (lg.matches) {
    return 'lg';
  }

  if (md.matches) {
    return 'md';
  }

  if (sm.matches) {
    return 'sm';
  }

  return 'xs';
};

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
  const [breakpoint, setBreakpoint] = useState(getBreakpoint);
  const columns = breakpoints[breakpoint];
  const { width } = useWindowSize();
  const cols: ReactNode[][] = Array.from(new Array(columns), () => []);
  const flat = Array.isArray(children) ? children.flat() : [children];

  useEffect(() => {
    setBreakpoint(getBreakpoint);
  }, [width]);

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

export default memo(Masonry);
