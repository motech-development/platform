import { ButtonHTMLAttributes, FC, forwardRef } from 'react';
import Link from './Link';

export type TButtonLinkProps = ButtonHTMLAttributes<HTMLButtonElement>;

// eslint-disable-next-line react/jsx-props-no-spreading
const ButtonLink: FC<TButtonLinkProps> = forwardRef<
  HTMLButtonElement,
  TButtonLinkProps
>((props, ref) => <Link as="button" ref={ref} {...props} />);

export default ButtonLink;
