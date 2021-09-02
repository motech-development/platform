import { ButtonHTMLAttributes, forwardRef } from 'react';
import Link from './Link';

export type TButtonLinkProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonLink = forwardRef<
  HTMLButtonElement,
  TButtonLinkProps
  // eslint-disable-next-line react/jsx-props-no-spreading
>((props, ref) => <Link as="button" ref={ref} {...props} />);

export default ButtonLink;
