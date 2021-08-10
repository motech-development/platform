import { FC } from 'react';

export interface IProgressBarProps {
  max?: number;
  progress: number;
}

// { max = 100, progress }
const ProgressBar: FC<IProgressBarProps> = () => <div />;

export default ProgressBar;
