import { Button, Col, Row } from '@motech-development/breeze-ui';
import { FC, memo } from 'react';

export interface IFormFooterProps {
  change: string;
  isValid: boolean;
  loading: boolean;
  submit: string;
  onChange: () => void;
}

const FormFooter: FC<IFormFooterProps> = ({
  change,
  isValid,
  loading,
  onChange,
  submit,
}) => (
  <Row gutter="0">
    <Col xs={6}>
      <Button
        block
        colour="success"
        type="submit"
        size="lg"
        disabled={!isValid}
        loading={loading}
      >
        {submit}
      </Button>
    </Col>

    <Col xs={6}>
      <Button block size="lg" onClick={onChange}>
        {change}
      </Button>
    </Col>
  </Row>
);

export default memo(FormFooter);
