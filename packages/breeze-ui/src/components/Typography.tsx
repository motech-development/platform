import { FC, ReactNode } from 'react';
import {
  classNames,
  spacingClass,
  textAlignmentClass,
} from '../utils/className';
import TAlignment from '../utils/alignment';
import TSpacing from '../utils/spacing';
import Element from './Element';

export enum TypographyComponent {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
}

export enum TypographyVariant {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  P = 'p',
  Lead = 'lead',
}

export type TTypographyComponent = `${TypographyComponent}`;

export type TTypographyVariant = `${TypographyVariant}`;

export interface ITypographyProps {
  align?: TAlignment;
  breakWord?: boolean;
  children: ReactNode;
  className?: string;
  component: TTypographyComponent;
  id?: string;
  margin?: TSpacing;
  rule?: boolean;
  truncate?: boolean;
  variant: TTypographyVariant;
}

const variantStyles = (variant: TTypographyVariant) => {
  switch (variant) {
    case 'h1':
      return 'font-display text-5xl font-semibold';
    case 'h2':
      return 'font-display text-4xl font-semibold';
    case 'h3':
      return 'font-display text-3xl font-semibold';
    case 'h4':
      return 'font-display text-2xl font-semibold';
    case 'h5':
      return 'font-display text-xl font-semibold';
    case 'h6':
      return 'font-display text-lg font-semibold';
    case 'lead':
      return 'font-light text-xl';
    default:
      return 'font-sans';
  }
};

const ruleAlignmentClass = (alignment: TAlignment) => {
  switch (alignment) {
    case 'center':
      return 'm-auto';
    case 'right':
      return 'ml-auto';
    default:
      return 'mr-auto';
  }
};

const ruleSpacingClass = (spacing: TSpacing) => {
  switch (spacing) {
    case 'lg':
      return 'mb-2.5';
    case 'md':
      return 'mb-1.5';
    case 'sm':
      return 'mb-0.5';
    default:
      return '';
  }
};

const Typography: FC<ITypographyProps> = ({
  align = 'left',
  breakWord = false,
  children,
  className = '',
  component,
  id,
  margin = 'md',
  rule = false,
  truncate = false,
  variant,
}) => (
  <div>
    {/* @tailwind: mb-0 mb-2 mb-4 mb-6 */}
    <Element
      id={id}
      className={classNames(
        className,
        breakWord ? 'break-words' : '',
        truncate ? 'truncate' : '',
        rule ? ruleSpacingClass(margin) : spacingClass(margin, 'mb-{spacing}'),
        textAlignmentClass(align),
        variantStyles(variant),
      )}
      as={component}
    >
      {children}
    </Element>

    {rule && (
      <hr
        className={classNames(
          'w-12 border-t-4 border-red-600 shadow-md',
          ruleAlignmentClass(align),
          ruleSpacingClass(margin),
        )}
      />
    )}
  </div>
);

export default Typography;
