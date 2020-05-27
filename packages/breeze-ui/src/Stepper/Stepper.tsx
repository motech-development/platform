import React, { FC, memo, ReactNode, useState } from 'react';
import Button from '../Button/Button';
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
        <ProgressBar progress={progress} />
      </Col>

      <Col xs={6}>
        <Button disabled={disablePrevious} onClick={previous}>
          {previousLabel}
        </Button>
      </Col>

      <Col xs={6} align="right">
        {showNext ? (
          <Button disabled={!enableNext(step)} onClick={next}>
            {nextLabel}
          </Button>
        ) : (
          onComplete
        )}
      </Col>
    </Row>
  );
};

export default memo(Stepper);
