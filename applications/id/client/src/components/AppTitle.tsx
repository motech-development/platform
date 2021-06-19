import { Typography } from '@motech-development/breeze-ui';
import { FC } from 'react';
import styled from 'styled-components';

const Text = styled(Typography)`
  white-space: pre-wrap;
`;

const AppTitle: FC = () => {
  const title = window.config?.dict?.signin?.title || ' ';

  return (
    <Text align="center" component="h2" variant="h1" margin="lg">
      {title}
    </Text>
  );
};

export default AppTitle;
