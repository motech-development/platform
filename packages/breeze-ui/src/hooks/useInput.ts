import { classNames, themeClass } from '../utils/className';
import TTheme from '../utils/theme';

const useInput = (
  name: string,
  theme: TTheme,
  helpText?: string,
  errorMessage?: string,
  className = '',
) => {
  const inputDescription = `${name}-description`;
  const errorDescription = `${name}-error`;
  const describedBy: string[] = [];
  const inputTheme = errorMessage ? 'danger' : theme;
  // @tailwind: focus:ring-blue-500 focus:border-blue-500
  // @tailwind: focus:ring-gray-500 focus:border-gray-500
  // @tailwind: focus:ring-green-500 focus:border-green-500
  // @tailwind: focus:ring-red-500 focus:border-red-500
  // @tailwind: focus:ring-yellow-500 focus:border-yellow-500
  const styles = classNames(
    'block w-full sm:text-sm',
    errorMessage ? 'border-red-300 pr-10' : 'border-gray-300',
    themeClass(inputTheme, 'focus:ring-{theme}-500 focus:border-{theme}-500'),
    className,
  );

  if (helpText) {
    describedBy.push(inputDescription);
  }

  if (errorMessage) {
    describedBy.push(errorDescription);
  }

  return {
    describedBy: describedBy.join(' '),
    errorDescription,
    inputDescription,
    inputTheme,
    styles,
  };
};

export default useInput;
