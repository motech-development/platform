import React, { FC, memo, ReactNode } from 'react';
import styled from 'styled-components';
import Col from '../Col/Col';
import Row from '../Row/Row';

const Wrapper = styled.div`
  margin: 100px 0;
  padding: 1rem;
`;

export interface IWindowProps {
  children: ReactNode;
}

const Window: FC<IWindowProps> = ({ children }) => (
  <Wrapper>
    <Row>
      <Col sm={8} smOffset={3} md={6} mdOffset={4} lg={4} lgOffset={5}>
        {children}
      </Col>
    </Row>
  </Wrapper>
);

export default memo(Window);
