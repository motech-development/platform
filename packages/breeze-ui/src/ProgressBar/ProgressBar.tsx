import { rgba } from 'polished';
import React, { FC, memo } from 'react';
import styled from 'styled-components';

const ProgressBarInternal = styled.progress`
  appearance: none;
  background-color: ${rgba('#2e9dc8', 0.25)};
  border: none;
  height: 10px;
  margin: 0;
  padding: 0;
  width: 100%;

  &::-webkit-progress-bar {
    background-color: ${rgba('#2e9dc8', 0.25)};
    height: 10px;
  }

  &::-webkit-progress-value {
    background-color: #2e9dc8;
    height: 10px;
    transition: width 0.4s linear;
  }

  &::-moz-progress-bar {
    background-color: #2e9dc8;
    height: 10px;
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
