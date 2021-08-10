import TSpacing from './spacing';
import TTheme from './theme';

export const className = (...name: string[]) => name.join(' ');

export const themeClass = (theme: TTheme, name: string) => {
  let mapping: string;

  switch (theme) {
    case 'danger':
      mapping = 'red';
      break;
    case 'secondary':
      mapping = 'gray';
      break;
    case 'success':
      mapping = 'green';
      break;
    case 'warning':
      mapping = 'yellow';
      break;
    default:
      mapping = 'blue';
  }

  return name.replace('{theme}', mapping);
};

export const spacingClass = (spacing: TSpacing, name: string) => {
  let mapping: string;

  switch (spacing) {
    case 'lg':
      mapping = '6';
      break;
    case 'md':
      mapping = '4';
      break;
    case 'sm':
      mapping = '2';
      break;
    default:
      mapping = '0';
  }

  return name.replace('{spacing}', mapping);
};
