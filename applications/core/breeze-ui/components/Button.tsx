import { FC, HTMLAttributes } from 'react';

type TColour = 'danger' | 'primary' | 'secondary' | 'success';

type TSize = 'sm' | 'md' | 'lg';

const styles = (colour: TColour, size: TSize, block: boolean) => {
  let colourStyles: string;
  let sizeStyles: string;

  switch (colour) {
    case 'danger':
      colourStyles =
        'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-gray-100';
      break;
    case 'secondary':
      break;
    case 'success':
      colourStyles =
        'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-gray-100';
      break;
    default:
      colourStyles =
        'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-gray-100';
  }

  switch (size) {
    case 'sm':
      break;
    case 'lg':
      break;
    default:
      sizeStyles = 'py-2 px-4';
  }

  const blockStyles = block ? 'w-full' : '';

  return `${colourStyles} ${blockStyles} ${sizeStyles}`;
};

interface IButtonProps extends HTMLAttributes<HTMLButtonElement> {
  block?: boolean;
  colour?: TColour;
  size?: TSize;
  disabled?: boolean;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button';
}

const Button: FC<IButtonProps> = ({
  block = false,
  colour = 'primary',
  size = 'md',
  type = 'button',
  ...rest
}) => (
  <button
    className={`group relative shadow-2xl flex font-display font-semibold justify-center text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${styles(
      colour,
      size,
      block,
    )}`}
    type={type}
    {...rest}
  ></button>
);

export default Button;
