import { FC, ReactNode } from 'react';

export interface IStepperProps {
  children: ReactNode[];
  nextLabel: string;
  onComplete?: ReactNode;
  onStart?: ReactNode;
  previousLabel: string;
  start?: number;
  enableNext?(step: number): boolean;
}

// {
//   children,
//   enableNext = () => true,
//   nextLabel,
//   onComplete,
//   onStart,
//   previousLabel,
//   start = 0,
// }
const Stepper: FC<IStepperProps> = () => <div />;

export default Stepper;
