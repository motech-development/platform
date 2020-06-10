import { memo } from 'react';
import styled from 'styled-components';

const BaseLink = styled.a`
  appearance: none;
  background: none;
  border: 0;
  color: #007aa3;
  cursor: pointer;
  font-weight: 600;
  font-size: inherit;
  margin: 0;
  padding: 0;
  text-decoration: underline;

  :hover {
    color: rgb(199, 56, 79);
    text-decoration: none;
  }
`;

export default memo(BaseLink);
