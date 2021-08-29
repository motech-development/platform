import TTheme from '../utils/theme';

const useInput = (
  name: string,
  theme: TTheme,
  helpText?: string,
  errorMessage?: string,
) => {
  const inputDescription = `${name}-description`;
  const errorDescription = `${name}-error`;
  const describedBy: string[] = [];
  const inputTheme = errorMessage ? 'danger' : theme;

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
  };
};

export default useInput;
