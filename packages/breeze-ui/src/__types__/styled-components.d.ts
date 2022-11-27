import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    [colour: string]: {
      background: string;
      colour: string;
    };
  }
}
