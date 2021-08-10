import { FC, ReactNode } from 'react';
import Col from './Col';
import Row from './Row';

export interface IWindowProps {
  children: ReactNode;
}

const Window: FC<IWindowProps> = ({ children }) => (
  <div>
    <Row>
      <Col sm={8} smOffset={3} md={6} mdOffset={4} lg={4} lgOffset={5}>
        {children}
      </Col>
    </Row>
  </div>
);

export default Window;
