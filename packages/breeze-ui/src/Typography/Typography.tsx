import { FC, memo, createElement, ReactNode } from 'react';
import styled from 'styled-components';

type TypographyVariants = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

export interface ITypographyProps {
  align?: 'left' | 'right' | 'center';
  children: ReactNode;
  component: TypographyVariants;
  variant: TypographyVariants | 'lead';
}

function createBase(props: ITypographyProps) {
  const { component } = props;
  const Component = styled(component)<ITypographyProps>`
    ${({ align = 'left', variant }) => `
      text-align: ${align};

      ${(() => {
        switch (variant) {
          case 'p':
            return `
              color: inherit;
              line-height: 1.5;
              margin: 0 0 1rem;
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
              margin-bottom: .5rem;
          `;
        }
      })()}
    `}
  `;

  return createElement(Component, props);
}

const Typography: FC<ITypographyProps> = props => createBase(props);

export default memo(Typography);
