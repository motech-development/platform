import { ElementType } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import { Themes, TTheme, useTailwind } from '../utilities/tailwind';

/** Default component element */
const DEFAULT_ELEMENT = 'div';

/** Toolbar component props */
export type TToolbarProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  {
    /** Apply border */
    border?: boolean;

    /** Fix position */
    fixed?: boolean;

    /** Component theme */
    theme?: TTheme;
  }
>;

/**
 * Flexible application toolbar
 *
 * @param props - Component props
 *
 * @returns Toolbar componenet
 */
export function Toolbar<E extends ElementType = typeof DEFAULT_ELEMENT>({
  border = false,
  children,
  fixed = false,
  theme = Themes.SECONDARY,
  ...rest
}: TToolbarProps<E>) {
  const { createStyles } = useTailwind(theme);

  const outerStyles = createStyles({
    classNames: [
      {
        'fixed top-0 left-0 w-full': fixed,
        relative: !fixed,
      },
    ],
    theme: {
      danger: ['bg-red-900 text-red-50'],
      primary: ['bg-blue-900 text-blue-50'],
      secondary: ['bg-gray-900 text-gray-50'],
      success: ['bg-green-900 text-green-50'],
      warning: ['bg-yellow-900 text-yellow-50'],
    },
  });

  const innerStyles = createStyles({
    classNames: [
      {
        'border-b': border,
      },
    ],
    theme: {
      danger: ['border-red-800'],
      primary: ['border-blue-800'],
      secondary: ['border-gray-800'],
      success: ['border-green-800'],
      warning: ['border-yellow-800'],
    },
  });

  return (
    <Box className={outerStyles} as={DEFAULT_ELEMENT} {...rest}>
      <div className="mx-auto max-w-7xl select-none sm:px-6 lg:px-8">
        <div className={innerStyles}>
          <div className="flex h-16 items-center justify-between px-4 sm:px-0">
            {children}
          </div>
        </div>
      </div>
    </Box>
  );
}
