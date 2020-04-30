import { memo } from 'react';
import styled from 'styled-components';

const OptionLabel = styled.label`
  cursor: pointer;
  display: inline-flex;
  margin-right: 10px;
`;

export default memo(OptionLabel);
