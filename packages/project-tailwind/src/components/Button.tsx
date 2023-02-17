import { ElementType } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import {
  Sizing,
  Themes,
  TSizing,
  TTheme,
  useTailwind,
} from '../utilities/tailwind';

/** Default component element */
const DEFAULT_ELEMENT = 'button';

/** Button component props */
export type TButtonProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  {
    /** Renders component as a block element */
    block?: boolean;

    /** Component theme */
    theme?: TTheme;

    /** Component size */
    size?: TSizing;
  }
>;

/**
 * Flexible call to action button
 *
 * @param props - Button component props
 *
 * @returns Button component
 */
export function Button<E extends ElementType = typeof DEFAULT_ELEMENT>({
  block = false,
  className,
  disabled,
  theme = Themes.PRIMARY,
  size = Sizing.MD,
  ...rest
}: TButtonProps<E>) {
  const { createStyles } = useTailwind(theme, size);

  const buttonStyles = createStyles({
    classNames: [
      {
        'cursor-not-allowed bg-opacity-75 hover:bg-opacity-75': disabled,
        'w-full': block,
      },
      'group items-center relative shadow-2xl inline-flex font-display justify-center font-medium transition-colors select-none focus:outline-none focus:ring-2 focus:ring-offset-2',
      className,
    ],
    sizing: {
      lg: ['py-4 px-6 text-lg'],
      md: ['py-2 px-4 text-base'],
      none: ['p-0 text-sm'],
      sm: ['py-0 px-2 text-sm'],
    },
    theme: {
      danger: [
        'bg-red-600 text-white',
        {
          'hover:bg-red-700 focus:ring-red-500': !disabled,
        },
      ],
      primary: [
        'bg-blue-600 text-white',
        {
          'hover:bg-blue-700 focus:ring-blue-500': !disabled,
        },
      ],
      secondary: [
        'bg-gray-100 text-gray-600',
        {
          'hover:bg-gray-300 focus:ring-gray-500': !disabled,
        },
      ],
      success: [
        'bg-green-600 text-white',
        {
          'hover:bg-green-700 focus:ring-green-500': !disabled,
        },
      ],
      warning: [
        'bg-yellow-600 text-white',
        {
          'hover:bg-yellow-700 focus:ring-yellow-500': !disabled,
        },
      ],
    },
  });

  return (
    <Box
      className={buttonStyles}
      as={DEFAULT_ELEMENT}
      {...{ disabled }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    >
      Test
    </Box>
  );
}
