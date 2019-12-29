import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface IColContainer {
  lg: number;
  lgOffset: number;
  md: number;
  mdOffset: number;
  sm: number;
  smOffset: number;
  xs: number;
  xsOffset: number;
}

const ColContainer = styled.div<IColContainer>`
  ${({ lg, lgOffset, md, mdOffset, sm, smOffset, xs, xsOffset }) => `
    grid-column: ${xsOffset > 0 ? `${xsOffset} / span ${xs}` : `span ${xs}`};
    position: relative;

    ${
      sm
        ? `
      @media (min-width: 576px) {
        grid-column: ${
          smOffset > 0 ? `${smOffset} / span ${sm}` : `span ${sm}`
        };
      }
    `
        : ''
    }

    ${
      md
        ? `
      @media (min-width: 768px) {
        grid-column: ${
          mdOffset > 0 ? `${mdOffset} / span ${md}` : `span ${md}`
        };
      }
    `
        : ''
    }

    ${
      lg
        ? `
      @media (min-width: 992px) {
        grid-column: ${
          lgOffset > 0 ? `${lgOffset} / span ${lg}` : `span ${lg}`
        };
      }
    `
        : ''
    }
  `}
`;

export interface IColProps {
  children: ReactNode;
  lg?: number;
  lgOffset?: number;
  md?: number;
  mdOffset?: number;
  sm?: number;
  smOffset?: number;
  xs?: number;
  xsOffset?: number;
}

const Col: FC<IColProps> = ({
  children,
  lg = 0,
  lgOffset = 0,
  md = 0,
  mdOffset = 0,
  sm = 0,
  smOffset = 0,
  xs = 12,
  xsOffset = 0,
}) => (
  <ColContainer
    lg={lg}
    lgOffset={lgOffset}
    md={md}
    mdOffset={mdOffset}
    sm={sm}
    smOffset={smOffset}
    xs={xs}
    xsOffset={xsOffset}
  >
    {children}
  </ColContainer>
);

export default memo(Col);
