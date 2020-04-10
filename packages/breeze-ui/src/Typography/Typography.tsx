import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

type TypographyVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface IBaseTypographyProps {
  align: 'left' | 'right' | 'center';
  margin: keyof typeof margins;
  variant: TypographyVariants | 'lead';
}

const BaseTypography = styled.p<IBaseTypographyProps>`
  ${({ align = 'left', margin = 'md', variant }) => `
    text-align: ${align};
    margin: ${margins[margin] ? `0 0 ${margins[margin]}rem` : '0'};

    ${(() => {
      switch (variant) {
        case 'p':
          return `
            color: inherit;
            line-height: 1.5;
          `;
        case 'lead':
          return `
            font-size: 1.25rem;
            font-weight: 300;
            line-height: 1.5;
          `;
        default:
          return `
            color: inherit;
            font-family: 'Cabin', sans-serif;
            font-size: ${(() => {
              switch (variant) {
                case 'h6':
                  return '1rem';
                case 'h5':
                  return '1.25rem';
                case 'h4':
                  return '1.5rem';
                case 'h3':
                  return '1.75rem';
                case 'h2':
                  return '2rem';
                default:
                  return '2.5rem';
              }
            })()};
            font-weight: 600;
            line-height: 1.2;
        `;
      }
    })()}
  `}
`;

const margins = {
  lg: 1,
  md: 0.5,
  none: 0,
  sm: 0.25,
};

interface ILineProps {
  margin: keyof typeof margins;
}

const Line = styled.hr<ILineProps>`
  ${({ margin }) => `
    border: 0;
    border-top: 2.5px solid #2e9dc8;
    margin: ${margins[margin] ? `${margins[margin]}rem 0` : '0'};
    padding: 0;

  `}
`;

export interface ITypographyProps {
  align?: 'left' | 'right' | 'center';
  children: ReactNode;
  className?: string;
  component: TypographyVariants;
  margin?: keyof typeof margins;
  rule?: boolean;
  variant: TypographyVariants | 'lead';
}

const Typography: FC<ITypographyProps> = ({
  align = 'left',
  children,
  className = '',
  component,
  margin = 'md',
  rule = false,
  variant,
}) => (
  <>
    <BaseTypography
      as={component}
      align={align}
      className={className}
      margin={margin}
      variant={variant}
    >
      {children}
    </BaseTypography>

    {rule && <Line margin={margin} />}
  </>
);

export default memo(Typography);
