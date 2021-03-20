import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const BaseStyles = createGlobalStyle`
  ${reset}

  body,
  html {
    background: #161616;
    color: #fff;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
`;

export default BaseStyles;
