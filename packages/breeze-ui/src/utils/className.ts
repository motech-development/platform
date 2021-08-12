import TAlignment from './alignment';
import TSpacing from './spacing';
import TTheme from './theme';

export const classNames = (...name: string[]) => name.filter(Boolean).join(' ');

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

  return name.replace(/{theme}/g, mapping);
};

export const spacingClass = (spacing: TSpacing, name: string, offset = 0) => {
  let mapping: string;

  switch (spacing) {
    case 'lg':
      mapping = `${6 - offset}`;
      break;
    case 'md':
      mapping = `${4 - offset}`;
      break;
    case 'sm':
      mapping = `${2 - offset}`;
      break;
    default:
      mapping = '0';
  }

  return name.replace(/{spacing}/g, mapping);
};

export const textAlignmentClass = (alignment: TAlignment) => {
  switch (alignment) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};
