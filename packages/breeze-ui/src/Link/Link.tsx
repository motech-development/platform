import React, { FC, memo } from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import styled from 'styled-components';

const BaseLink = styled(RouterLink)<LinkProps>`
  color: #007fa8;
  font-weight: 600;

  :hover {
    color: #ed008c;
  }
`;

const Link: FC<LinkProps> = props => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BaseLink {...props} />
);

export default memo(Link);
