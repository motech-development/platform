import { createElement, FC, HTMLProps } from 'react';

type TAlign = 'left' | 'right' | 'center';

type TComponent = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

type TMargin = 'none' | 'sm' | 'md' | 'lg';

type TVariant = TComponent | 'lead';

const headingStyles = (
  align: TAlign,
  margin: TMargin,
  variant: TVariant,
  rule: boolean,
) => {
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
      marginStyles = rule ? 'mb-1' : 'mb-2';
      break;
    case 'md':
      marginStyles = rule ? 'mb-1.5' : 'mb-4';
      break;
    case 'lg':
      marginStyles = rule ? 'mb-3' : 'mb-6';
      break;
    default:
      marginStyles = 'mb-0';
  }

  switch (variant) {
    case 'h1':
      variantStyles = 'font-display text-5xl font-semibold';
      break;
    case 'h2':
      variantStyles = 'font-display text-4xl font-semibold';
      break;
    case 'h3':
      variantStyles = 'font-display text-3xl font-semibold';
      break;
    case 'h4':
      variantStyles = 'font-display text-2xl font-semibold';
      break;
    case 'h5':
      variantStyles = 'font-display text-xl font-semibold';
      break;
    case 'h6':
      variantStyles = 'font-display text-lg font-semibold';
      break;
    case 'lead':
      variantStyles = 'font-light text-xl';
      break;
    default:
      variantStyles = 'font-sans';
  }

  return `${alignStyles} ${marginStyles} ${variantStyles}`;
};

const ruleStyles = (align: TAlign, margin: TMargin) => {
  let alignStyles: string;
  let marginStyles: string;

  switch (align) {
    case 'center':
      alignStyles = 'mx-auto';
      break;
    case 'right':
      alignStyles = 'ml-auto';
      break;
    default:
  }

  switch (margin) {
    case 'md':
      marginStyles = 'mb-1.5';
      break;
    case 'lg':
      marginStyles = 'mb-2';
      break;
    default:
      marginStyles = 'mb-0';
  }

  return `${alignStyles} ${marginStyles}`;
};

const Element: FC<{
  align: TAlign;
  className?: string;
  component: TComponent;
  margin: TMargin;
  rule: boolean;
  variant: TVariant;
}> = ({
  align,
  children,
  className,
  component,
  margin,
  rule,
  variant,
  ...rest
}) =>
  createElement(
    component,
    {
      ...rest,
      className: `${className} ${headingStyles(align, margin, variant, rule)}`,
    },
    children,
  );

interface ITypographyProps extends HTMLProps<HTMLElement> {
  align?: TAlign;
  component: TComponent;
  margin?: TMargin;
  rule?: boolean;
  variant: TVariant;
}

const Typography: FC<ITypographyProps> = ({
  align = 'left',
  component,
  margin = 'md',
  rule = false,
  variant,
  ...rest
}) => (
  <div>
    <Element
      align={align}
      component={component}
      margin={margin}
      rule={rule}
      variant={variant}
      {...rest}
    />

    {rule && (
      <hr
        className={`w-12 border-0 border-b-4 border-red-600 shadow-md ${ruleStyles(
          align,
          margin,
        )}`}
      />
    )}
  </div>
);

export default Typography;
