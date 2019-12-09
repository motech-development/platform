import { memo } from 'react';
import styled from 'styled-components';

export const InputWrapper = styled.div`
  background: #fff;
  border: 1px solid #ccc;
  margin-bottom: 8px;
  padding: 0 8px;
  position: relative;
`;

export default memo(InputWrapper);
