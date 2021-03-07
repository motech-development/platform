import { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.section`
  background-color: #f8f8f8;
  color: #000;
  display: block;
  padding: 1rem;
`;

export interface IContentProps {
  children: ReactNode;
}

const Content: FC<IContentProps> = ({ children }) => (
  <Wrapper>{children}</Wrapper>
);

export default memo(Content);
