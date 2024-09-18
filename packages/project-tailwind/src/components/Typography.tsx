import { Slot } from '@radix-ui/react-slot';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  Alignment,
  Sizing,
  TAlignment,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';
import { ISlot } from './Slot';

/** Variant options */
enum Variants {
  /** Body */
  BODY = 'body',
  /** Heading 1 */
  HEADING_1 = 'h1',
  /** Heading 2 */
  HEADING_2 = 'h2',
  /** Heading 3 */
  HEADING_3 = 'h3',
  /** Heading 4 */
  HEADING_4 = 'h4',
  /** Heading 5 */
  HEADING_5 = 'h5',
  /** Heading 6 */
  HEADING_6 = 'h6',
  /** Lead */
  LEAD = 'lead',
}

/** Variant type */
type TVariant = `${Variants}`;

/** Default component element */
const DEFAULT_ELEMENT = 'p';

/** Typography component props */
export interface ITypographyProps extends ISlot, ComponentPropsWithoutRef<'p'> {
  /** Text alignment */
  align?: TAlignment;

  /** Apply line break for overflowing text */
  breakWord?: boolean;

  /** Apply margin to text */
  margin?: TSizing;

  /** Add horizontal rule */
  rule?: boolean;

  /** Component theme */
  theme?: TTheme;

  /** Truncate text string */
  truncate?: boolean;

  /** Text variant */
  variant?: TVariant;
}

/**
 * Creates font styles for text variants
 *
 * @param variant - Text variant type
 *
 * @returns Class names
 */
function createFontStyles(variant: TVariant) {
  switch (variant) {
    case Variants.HEADING_1:
      return 'font-display text-5xl font-semibold';
    case Variants.HEADING_2:
      return 'font-display text-4xl font-semibold';
    case Variants.HEADING_3:
      return 'font-display text-3xl font-semibold';
    case Variants.HEADING_4:
      return 'font-display text-2xl font-semibold';
    case Variants.HEADING_5:
      return 'font-display text-xl font-semibold';
    case Variants.HEADING_6:
      return 'font-display text-lg font-semibold';
    case Variants.LEAD:
      return 'font-light text-xl';
    case Variants.BODY:
    default:
      return 'font-sans';
  }
}

/**
 * Creates spacing classes for horizontal rule
 *
 * @param spacing - Spacing size
 *
 * @returns Class names
 */
function createRuleSpacingStyles(rule: boolean, spacing: TSizing) {
  switch (spacing) {
    case Sizing.LG:
      return rule ? 'mb-2.5' : 'mb-6';
    case Sizing.SM:
      return rule ? 'mb-0.5' : 'mb-2';
    case Sizing.MD:
      return rule ? 'mb-1.5' : 'mb-4';
    default:
      return rule ? 'mb-1.5' : 'mb-0';
  }
}

/**
 * Creates alignment classes for horizontal rule
 *
 * @param alignment - Horizontal rule alignment
 *
 * @returns Class names
 */
function createRuleAlignmentStyles(alignment: TAlignment) {
  switch (alignment) {
    case Alignment.CENTRE:
      return 'm-auto';
    case Alignment.RIGHT:
      return 'ml-auto';
    case Alignment.LEFT:
    default:
      return 'mr-auto';
  }
}

/**
 * Standardised typography
 *
 * @param props - Typography component props
 *
 * @returns Typography component
 */
export const Typography = forwardRef<HTMLParagraphElement, ITypographyProps>(
  (
    {
      align = Alignment.LEFT,
      asChild,
      breakWord = false,
      className,
      margin = Sizing.MD,
      rule = false,
      theme = Themes.DANGER,
      truncate = false,
      variant = Variants.BODY,
      ...rest
    },
    ref,
  ) => {
    const { createStyles, createTextAlignmentStyles } = useTailwind(
      theme,
      margin,
    );

    const Comp = asChild ? Slot : DEFAULT_ELEMENT;

    const ruleStyles = createStyles({
      classNames: [
        'w-12 border-t-4 shadow-md',
        createRuleSpacingStyles(rule, margin),
        createRuleAlignmentStyles(align),
      ],
      theme: {
        danger: ['border-red-600'],
        primary: ['border-blue-600'],
        secondary: ['border-gray-600'],
        success: ['border-green-600'],
        warning: ['border-yellow-600'],
      },
    });

    const typographyStyles = createStyles({
      classNames: [
        {
          'bread-words': breakWord,
          truncate,
        },
        createFontStyles(variant),
        createTextAlignmentStyles(align),
        createRuleSpacingStyles(rule, margin),
        className,
      ],
    });

    return (
      <div>
        <Comp className={typographyStyles} ref={ref} {...rest} />

        {rule && <hr className={ruleStyles} />}
      </div>
    );
  },
);
