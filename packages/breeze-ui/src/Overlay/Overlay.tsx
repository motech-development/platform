import { memo } from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

export default memo(Overlay);
