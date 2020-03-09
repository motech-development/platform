import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

interface IMasonryItemContainerProps {
  gutter: string;
}

const MasonryItemContainer = styled.div<IMasonryItemContainerProps>`
  ${({ gutter }) => `
    -webkit-column-break-inside: avoid;
    break-inside: avoid;
    display: inline-block;
    margin-bottom: ${gutter};
    page-break-inside: avoid;
    width: 100%;
  `}
`;

export interface IMasonryItemProps {
  children: ReactNode;
  gutter: string;
}

const MasonryItem: FC<IMasonryItemProps> = ({ children, gutter }) => (
  <MasonryItemContainer gutter={gutter}>{children}</MasonryItemContainer>
);

export default memo(MasonryItem);
