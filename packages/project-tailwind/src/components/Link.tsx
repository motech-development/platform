import { ElementType } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import {
  TTheme,
  TSizing,
  Themes,
  Sizing,
  useTailwind,
} from '../utilities/tailwind';

/** Default component element */
const DEFAULT_ELEMENT = 'a';

/** Link component props */
export type TLinkProps<E extends ElementType> = PolymorphicComponentProps<
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
 * Flexible anchor element
 *
 * @param props - Link component props
 *
 * @returns Link component
 */
export function Link<E extends ElementType = typeof DEFAULT_ELEMENT>({
  block = false,
  className,
  theme = Themes.PRIMARY,
  size = Sizing.MD,
  ...rest
}: TLinkProps<E>) {
  const { createStyles } = useTailwind(theme, size);

  const linkStyles = createStyles({
    classNames: [
      'appearance-none bg-none border-0 font-semibold underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2',
      {
        'block w-full text-center': block,
        'inline-block': !block,
      },
      className,
    ],
    sizing: {
      lg: ['text-lg'],
      md: ['text-base'],
      none: ['text-base'],
      sm: ['text-sm'],
    },
    theme: {
      danger: ['text-red-600 hover:text-red-700 focus:ring-red-500'],
      primary: ['text-blue-600 hover:text-blue-700 focus:ring-blue-500'],
      secondary: ['text-gray-600 hover:text-gray-700 focus:ring-gray-500'],
      success: ['text-green-600 hover:text-green-700 focus:ring-green-500'],
      warning: ['text-yellow-600 hover:text-yellow-700 focus:ring-yellow-500'],
    },
  });

  return <Box className={linkStyles} as={DEFAULT_ELEMENT} {...rest} />;
}
