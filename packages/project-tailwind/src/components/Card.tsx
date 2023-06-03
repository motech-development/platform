import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';

/** Card component props */
export interface ICardProps extends ComponentPropsWithoutRef<'div'> {
  /** Apply flexbox styles */
  flex?: boolean;

  /** Component padding */
  padding?: TSizing;

  /** Componenet theme */
  theme?: TTheme;
}

/**
 * Flexible and extensible content container
 *
 * @param props - Component props
 *
 * @returns Card componenet
 */
export const Card = forwardRef<HTMLDivElement, ICardProps>(
  (
    {
      className,
      flex = false,
      padding = Sizing.MD,
      theme = Themes.SECONDARY,
      ...rest
    },
    ref,
  ) => {
    const { createStyles } = useTailwind(theme, padding);

    const cardStyles = createStyles({
      classNames: [
        'border-b-2 shadow-lg',
        {
          'flex flex-col items-center': flex,
        },
        className,
      ],
      sizing: {
        lg: ['p-6'],
        md: ['p-4'],
        none: ['p-0'],
        sm: ['p-2'],
      },
      theme: {
        danger: ['bg-red-100 border-red-300 text-red-800'],
        primary: ['bg-blue-100 border-blue-300 text-blue-800'],
        secondary: ['bg-gray-100 border-gray-300 text-gray-800'],
        success: ['bg-green-100 border-green-300 text-green-800'],
        warning: ['bg-yellow-100 border-yellow-300 text-yellow-800'],
      },
    });

    return <div className={cardStyles} ref={ref} {...rest} />;
  },
);
