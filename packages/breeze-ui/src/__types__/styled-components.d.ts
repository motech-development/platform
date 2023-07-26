import 'styled-components';

interface ITheme {
  background?: string;
  border?: string;
  colour?: string;
  height?: string;
  margin?: string;
  padding?: string;
  spacing?: string;
  width?: string;
}

declare module 'styled-components' {
  export type TColour = 'primary' | 'danger' | 'secondary' | 'success';

  export type TSize = 'lg' | 'md' | 'none' | 'sm';

  export interface DefaultTheme {
    danger: ITheme;
    primary: ITheme;
    secondary: ITheme;
    success: ITheme;
  }
}
