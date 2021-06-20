import { createElement, FC, HTMLAttributes } from 'react';

type TAlign = 'left' | 'right' | 'center';

type TComponent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

type TMargin = 'none' | 'sm' | 'md' | 'lg';

type TVariant = TComponent | 'lead';

const styles = (align: TAlign, margin: TMargin, variant: TVariant) => {
  let alignStyles: string;
  let marginStyles: string;
  let variantStyles: string;

  switch (align) {
    case 'center':
      alignStyles = 'text-center';
      break;
    case 'right':
      alignStyles = 'text-right';
      break;
    default:
      alignStyles = 'text-left';
  }

  switch (margin) {
    case 'sm':
      break;
    case 'md':
      break;
    case 'lg':
      marginStyles = 'mb-6';
      break;
    default:
  }

  switch (variant) {
    case 'h1':
      variantStyles = 'font-display text-5xl font-semibold';
      break;
    case 'h2':
      variantStyles = 'font-display text-3xl font-semibold';
      break;
    case 'h3':
      variantStyles = 'font-display font-semibold';
      break;
    case 'h4':
      variantStyles = 'font-display font-semibold';
      break;
    case 'h5':
      variantStyles = 'font-display font-semibold';
      break;
    case 'h6':
      variantStyles = 'font-display font-semibold';
      break;
    case 'lead':
      variantStyles = 'font-light text-xl';
      break;
    default:
      variantStyles = 'font-sans';
  }

  return `${alignStyles} ${marginStyles} ${variantStyles}`;
};

interface ITypographyProps extends HTMLAttributes<HTMLElement> {
  align?: 'left' | 'right' | 'center';
  component: TComponent;
  margin?: TMargin;
  variant: TVariant;
}

const Typography: FC<ITypographyProps> = ({
  align = 'left',
  children,
  component,
  margin = 'md',
  variant,
  ...rest
}) =>
  createElement(
    component,
    {
      ...rest,
      className: `${styles(align, margin, variant)}`,
    },
    children,
  );

export default Typography;
