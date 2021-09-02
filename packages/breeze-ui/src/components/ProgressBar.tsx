import { forwardRef, ProgressHTMLAttributes } from 'react';
import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

export interface IProgressBarProps
  extends ProgressHTMLAttributes<HTMLProgressElement> {
  max?: number;
  progress: number;
  theme?: TTheme;
}

const ProgressBar = forwardRef<HTMLProgressElement, IProgressBarProps>(
  (
    { className = '', max = 100, progress, theme = 'primary', ...rest },
    ref,
  ) => (
    <>
      {/* @tailwind: webkit-progress-value:bg-blue-600 webkit-progress-value:bg-gray-600 webkit-progress-value:bg-green-600 webkit-progress-value:bg-red-600 webkit-progress-value:bg-yellow-600 */}
      {/* @tailwind: webkit-progress-bar:bg-blue-200 webkit-progress-bar:bg-gray-200 webkit-progress-bar:bg-green-200 webkit-progress-bar:bg-red-200 webkit-progress-bar:bg-yellow-200 */}
      {/* @tailwind: moz-progress-bar:bg-blue-600 moz-progress-bar:bg-gray-600 moz-progress-bar:bg-green-600 moz-progress-bar:bg-red-600 moz-progress-bar:bg-yellow-600 */}
      <progress
        className={classNames(
          'appearance-none border-0 p-0 m-0 w-full h-4 webkit-progress-value:h-4 webkit-progress-bar:h-4 moz-progress-bar:h-4',
          themeClass(
            theme,
            'webkit-progress-value:bg-{theme}-600 webkit-progress-bar:bg-{theme}-200 moz-progress-bar:bg-{theme}-600',
          ),
          className,
        )}
        max={max}
        value={progress}
        ref={ref}
        {...rest}
      />
    </>
  ),
);

export default ProgressBar;
