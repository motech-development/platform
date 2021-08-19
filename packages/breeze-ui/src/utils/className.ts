import TAlignment from './alignment';
import TSize from './size';
import TSpacing from './spacing';
import TTheme from './theme';

export const classNames = (...name: string[]) => name.filter(Boolean).join(' ');

interface IThemeClassOverride {
  danger?: string;
  prinary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
}

export const themeClass = (
  theme: TTheme,
  name: string,
  override?: IThemeClassOverride,
) => {
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

  if (override && override[theme]) {
    return override[theme].replace(/{theme}/g, mapping);
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

export const textSizingClass = (size: TSize) => {
  switch (size) {
    case 'sm':
      return 'text-sm';
    case 'lg':
      return 'text-lg';
    default:
      return 'text-base';
  }
};
