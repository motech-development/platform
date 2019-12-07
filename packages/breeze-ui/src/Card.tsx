import React, { FC } from 'react';
import styled from 'styled-components';

const BaseCard = styled.div``;

const Card: FC = ({ children }) => {
  return <BaseCard>{children}</BaseCard>;
};

export default Card;
