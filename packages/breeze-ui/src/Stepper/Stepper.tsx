import React, { FC, memo, ReactNode, useState } from 'react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Col from '../Col/Col';
import ProgressBar from '../ProgressBar/ProgressBar';
import Row from '../Row/Row';

export interface IStepper {
  children: ReactNode[];
  nextLabel: string;
  onComplete?: ReactNode;
  previousLabel: string;
  start?: number;
  enableNext?(step: number): boolean;
}

const Stepper: FC<IStepper> = ({
  children,
  enableNext = () => true,
  nextLabel,
  onComplete = undefined,
  previousLabel,
  start = 0,
}) => {
  const [step, setStep] = useState(start);
  const steps = children.length - 1;
  const next = () => {
    setStep(step + 1);
  };
  const showNext = step < steps;
  const previous = () => {
    setStep(step - 1);
  };
  const disablePrevious = step === 0;
  const progress = (step / steps) * 100;

  return (
    <Row>
      <Col>{children.map((child, index) => index === step && child)}</Col>

      <Col>
        <Row>
          <Col xs={12} md={6} mdOffset={7}>
            <Card padding="none">
              <ProgressBar progress={progress} />
            </Card>

            <Card padding="lg">
              <Row>
                <Col xs={12} md={6}>
                  <Button
                    block
                    disabled={disablePrevious}
                    size="lg"
                    onClick={previous}
                  >
                    {previousLabel}
                  </Button>
                </Col>

                <Col xs={12} md={6} align="right">
                  {showNext ? (
                    <Button
                      block
                      disabled={!enableNext(step)}
                      size="lg"
                      onClick={next}
                    >
                      {nextLabel}
                    </Button>
                  ) : (
                    onComplete
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default memo(Stepper);
