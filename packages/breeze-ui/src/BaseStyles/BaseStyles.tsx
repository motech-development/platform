import { memo } from 'react';
import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const BaseStyles = createGlobalStyle`
  ${reset}

  body,
  html {
    background: #161616;
    box-sizing: border-box;
    color: #fff;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
`;

export default memo(BaseStyles);
