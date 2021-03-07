import { rgba } from 'polished';
import { FC, memo } from 'react';
import styled from 'styled-components';

const ProgressBarInternal = styled.progress`
  appearance: none;
  background-color: ${rgba('#007fa8', 0.25)};
  border: none;
  height: 20px;
  margin: 0;
  padding: 0;
  width: 100%;

  &::-webkit-progress-bar {
    background-color: ${rgba('#007fa8', 0.25)};
    height: 20px;
  }

  &::-webkit-progress-value {
    background-color: #007fa8;
    height: 20px;
  }

  &::-moz-progress-bar {
    background-color: #007fa8;
    height: 20px;
  }
`;

export interface IProgressBarProps {
  max?: number;
  progress: number;
}

const ProgressBar: FC<IProgressBarProps> = ({ max = 100, progress }) => (
  <ProgressBarInternal max={max} value={progress} />
);

export default memo(ProgressBar);
