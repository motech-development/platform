import { Card, Col, Row } from '@motech-development/breeze-ui';
import React, { FC, memo, ReactElement } from 'react';

export interface IWindowProps {
  children: ReactElement;
}

const Window: FC<IWindowProps> = ({ children }) => (
  <Row>
    <Col sm={10} smOffset={2} md={8} mdOffset={3} lg={6} lgOffset={4}>
      <Card>{children}</Card>
    </Col>
  </Row>
);

export default memo(Window);
