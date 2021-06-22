import { FC, forwardRef, HTMLProps } from 'react';

const ButtonLink: FC<HTMLProps<HTMLButtonElement>> =
  forwardRef<HTMLButtonElement>((props, ref) => (
    <button
      className="appearance-none bg-none border-0 font-semibold text-blue-600 hover:text-red-600 hover:underline focus:outline-none"
      {...props}
      ref={ref}
    />
  ));

export default ButtonLink;
