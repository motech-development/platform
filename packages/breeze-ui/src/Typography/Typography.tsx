import { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

type TypographyVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

interface IBaseTypographyProps {
  $align: 'left' | 'right' | 'center';
  $breakWord: boolean;
  $margin: keyof typeof margins;
  $truncate: boolean;
  $variant: TypographyVariants | 'lead';
}

const BaseTypography = styled.p<IBaseTypographyProps>`
  ${({ $align, $breakWord, $margin, $truncate, $variant }) => `
    margin: ${margins[$margin] ? `0 0 ${margins[$margin]}rem` : '0'};
    text-align: ${$align};

    ${
      $breakWord
        ? `
      hyphens: auto;
      overflow-wrap: break-word;
      word-wrap: break-word;
      word-break: break-all;
      word-break: break-word;
    `
        : ''
    }

    ${
      $truncate
        ? `
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `
        : ''
    }

    ${(() => {
      switch ($variant) {
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
              switch ($variant) {
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
  $margin: keyof typeof margins;
}

const Line = styled.hr<ILineProps>`
  ${({ $margin }) => `
    border: 0;
    border-top: 2.5px solid #007fa8;
    margin: ${margins[$margin] ? `${margins[$margin]}rem 0` : '0'};
    padding: 0;

  `}
`;

export interface ITypographyProps {
  align?: 'left' | 'right' | 'center';
  breakWord?: boolean;
  children: ReactNode;
  className?: string;
  component: TypographyVariants;
  id?: string;
  margin?: keyof typeof margins;
  rule?: boolean;
  truncate?: boolean;
  variant: TypographyVariants | 'lead';
}

const Typography: FC<ITypographyProps> = ({
  align = 'left',
  breakWord = false,
  children,
  className = '',
  component,
  id = undefined,
  margin = 'md',
  rule = false,
  truncate = false,
  variant,
}) => (
  <>
    <BaseTypography
      id={id}
      as={component}
      className={className}
      $align={align}
      $breakWord={breakWord}
      $margin={margin}
      $truncate={truncate}
      $variant={variant}
    >
      {children}
    </BaseTypography>

    {rule && <Line $margin={margin} />}
  </>
);

export default memo(Typography);
