import { Children, FC, memo, ReactNode, useState } from 'react';
import Button from '../Button/Button';
import Card from '../Card/Card';
import Col from '../Col/Col';
import ProgressBar from '../ProgressBar/ProgressBar';
import Row from '../Row/Row';

export interface IStepperProps {
  children: ReactNode[];
  nextLabel: string;
  onComplete?: ReactNode;
  onStart?: ReactNode;
  previousLabel: string;
  start?: number;
  enableNext?(step: number): boolean;
}

const Stepper: FC<IStepperProps> = ({
  children,
  enableNext = () => true,
  nextLabel,
  onComplete,
  onStart,
  previousLabel,
  start = 0,
}) => {
  const [step, setStep] = useState(start);
  const activeStep = Children.toArray(children)[step];
  const steps = Children.count(children) - 1;
  const next = () => {
    setStep(step + 1);
  };
  const showNext = step < steps;
  const previous = () => {
    setStep(step - 1);
  };
  const disablePrevious = step === 0;
  const progress = (step / steps) * 100;
  const showOnStart = disablePrevious && onStart;

  return (
    <Row>
      <Col>{activeStep}</Col>

      <Col>
        <Row>
          <Col xs={12} md={6} mdOffset={7}>
            <Card padding="none">
              <ProgressBar progress={progress} />
            </Card>

            <Card padding="lg">
              <Row>
                <Col xs={12} md={6}>
                  {showOnStart && onStart}

                  {!showOnStart && (
                    <Button
                      block
                      disabled={disablePrevious}
                      size="lg"
                      onClick={previous}
                    >
                      {previousLabel}
                    </Button>
                  )}
                </Col>

                <Col xs={12} md={6} align="right">
                  {showNext && (
                    <Button
                      block
                      disabled={!enableNext(step)}
                      size="lg"
                      onClick={next}
                    >
                      {nextLabel}
                    </Button>
                  )}

                  {!showNext && onComplete}
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
