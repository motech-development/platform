import React, { FC, memo, ReactNode, useEffect, useState } from 'react';
import styled from 'styled-components';
import useWindowSize from '../hooks/useWindowSize';
import MasonryItem from '../MasonryItem/MasonryItem';

interface IMasonryContainerProps {
  columns: number;
  gutter: string;
}

const MasonryContainer = styled.div<IMasonryContainerProps>`
  ${({ columns, gutter }) => `
    column-count: ${columns};
    gap: ${gutter};
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

export interface IMasonryProps {
  children: ReactNode[];
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
  const flat = children.flat();

  useEffect(() => {
    const updatedBreakpoint = getBreakpoint();

    setBreakpoint(updatedBreakpoint);
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
    <MasonryContainer columns={columns} gutter={gutter}>
      {cols.map((_, i) => cols[i])}
    </MasonryContainer>
  );
};

export default memo(Masonry);
