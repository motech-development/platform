import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface IColContainer {
  align: 'centre' | 'left' | 'right';
  lg: number;
  lgOffset: number;
  md: number;
  mdOffset: number;
  sm: number;
  smOffset: number;
  verticalAlign: boolean;
  xs: number;
  xsOffset: number;
}

const ColContainer = styled.div<IColContainer>`
  ${({
    align,
    lg,
    lgOffset,
    md,
    mdOffset,
    sm,
    smOffset,
    verticalAlign,
    xs,
    xsOffset,
  }) => `
    grid-column: ${xsOffset > 0 ? `${xsOffset} / span ${xs}` : `span ${xs}`};
    position: relative;
    text-align ${align === 'centre' ? 'center' : align};

    ${
      verticalAlign
        ? `
      align-items: center;
      display: flex;
    `
        : ``
    }

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

const VericalAlignWrapper = styled.div`
  flex: 1;
`;

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

const Col: FC<IColProps> = ({
  children,
  align = 'left',
  lg = 0,
  lgOffset = 0,
  md = 0,
  mdOffset = 0,
  sm = 0,
  smOffset = 0,
  verticalAlign = null,
  xs = 12,
  xsOffset = 0,
}) => (
  <ColContainer
    align={align}
    lg={lg}
    lgOffset={lgOffset}
    md={md}
    mdOffset={mdOffset}
    sm={sm}
    smOffset={smOffset}
    verticalAlign={!!verticalAlign}
    xs={xs}
    xsOffset={xsOffset}
  >
    {verticalAlign ? (
      <VericalAlignWrapper>{children}</VericalAlignWrapper>
    ) : (
      children
    )}
  </ColContainer>
);

export default memo(Col);
