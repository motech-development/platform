import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const BaseStyles = createGlobalStyle`
  ${reset}

  body,
  html {
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

export default BaseStyles;
