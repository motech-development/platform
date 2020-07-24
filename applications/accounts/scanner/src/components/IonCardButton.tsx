import { IonCardContent } from '@ionic/react';
import { memo } from 'react';
import styled from 'styled-components';

const IonCardButton = styled(IonCardContent)`
  padding-top: 0;
`;

export default memo(IonCardButton);
