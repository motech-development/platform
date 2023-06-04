import { Slot } from '@radix-ui/react-slot';
import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';
import { ISlot } from './Slot';

/** Default component element */
const DEFAULT_ELEMENT = 'button';

/** Button component props */
export interface IButtonProps
  extends ISlot,
    ComponentPropsWithoutRef<'button'> {
  /** Renders component as a block element */
  block?: boolean;

  /** Component theme */
  theme?: TTheme;

  /** Component size */
  size?: TSizing;
}

/**
 * Flexible call to action button
 *
 * @param props - Button component props
 *
 * @returns Button component
 */
export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
  (
    {
      asChild,
      block = false,
      className,
      theme = Themes.PRIMARY,
      size = Sizing.MD,
      ...rest
    },
    ref,
  ) => {
    const { createStyles } = useTailwind(theme, size);

    const Comp = asChild ? Slot : DEFAULT_ELEMENT;

    const buttonStyles = createStyles({
      classNames: [
        {
          'block w-full': block,
          'cursor-not-allowed bg-opacity-75 hover:bg-opacity-75': rest.disabled,
          'inline-block': !block,
        },
        'group items-center relative shadow-2xl inline-flex font-display justify-center font-medium transition-colors select-none focus:outline-none focus:ring-2 focus:ring-offset-2',
        className,
      ],
      sizing: {
        lg: ['py-4 px-6 text-lg'],
        md: ['py-2 px-4 text-base'],
        none: ['py-2 px-4 text-base'],
        sm: ['py-0 px-2 text-sm'],
      },
      theme: {
        danger: [
          'bg-red-600 text-red-50',
          {
            'hover:bg-red-700 focus:ring-red-500': !rest.disabled,
          },
        ],
        primary: [
          'bg-blue-600 text-blue-50',
          {
            'hover:bg-blue-700 focus:ring-blue-500': !rest.disabled,
          },
        ],
        secondary: [
          'bg-gray-100 text-gray-600',
          {
            'hover:bg-gray-300 focus:ring-gray-500': !rest.disabled,
          },
        ],
        success: [
          'bg-green-600 text-green-50',
          {
            'hover:bg-green-700 focus:ring-green-500': !rest.disabled,
          },
        ],
        warning: [
          'bg-yellow-600 text-yellow-50',
          {
            'hover:bg-yellow-700 focus:ring-yellow-500': !rest.disabled,
          },
        ],
      },
    });

    return <Comp className={buttonStyles} ref={ref} {...rest} />;
  },
);
