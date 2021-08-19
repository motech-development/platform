import { ElementType } from 'react';
import { Box, PolymorphicComponentProps } from 'react-polymorphic-box';
import {
  classNames,
  spacingClass,
  textSizingClass,
  themeClass,
} from '../utils/className';
import TSize from '../utils/size';
import TTheme from '../utils/theme';

interface IBaseButtonProps<E extends ElementType> {
  as: E;
  block: boolean;
  colour: TTheme;
  size: TSize;
}

export type TBaseButtonProps<E extends ElementType> = PolymorphicComponentProps<
  E,
  IBaseButtonProps<E>
>;

const BaseButton = <E extends ElementType>({
  className = '',
  disabled,
  block,
  colour,
  size,
  ...rest
}: TBaseButtonProps<E>) => (
  <>
    {/* @tailwind: bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 */}
    {/* @tailwind: bg-gray-100 hover:bg-gray-300 focus:ring-gray-500 text-gray-600 */}
    {/* @tailwind: bg-green-600 hover:bg-green-700 focus:ring-green-500 */}
    {/* @tailwind: bg-red-600 hover:bg-red-700 focus:ring-red-500 */}
    {/* @tailwind: bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500 */}
    {/* @tailwind: py-0 py-2 py-4 */}
    {/* @tailwind: px-2 px-4 px-6 */}
    <Box
      className={classNames(
        'group items-center relative mt-auto shadow-2xl inline-flex font-display justify-center font-medium transition-colors select-none',
        themeClass(colour, 'bg-{theme}-600 text-white', {
          secondary:
            'bg-{theme}-100 hover:bg-{theme}-300 focus:ring-{theme}-500 text-{theme}-600',
        }),
        spacingClass(size, 'py-{spacing}', 2),
        spacingClass(size, 'px-{spacing}'),
        textSizingClass(size),
        block ? 'w-full' : '',
        disabled
          ? 'cursor-not-allowed bg-opacity-75 hover:bg-opacity-75'
          : themeClass(
              colour,
              'hover:bg-{theme}-700 focus:ring-{theme}-500 focus:outline-none focus:ring-2 focus:ring-offset-2',
            ),
        className,
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
    />
  </>
);

export default BaseButton;
