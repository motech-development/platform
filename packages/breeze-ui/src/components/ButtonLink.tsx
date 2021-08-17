import { ButtonHTMLAttributes, FC, DetailedHTMLProps } from 'react';
import Link from './Link';

export type TButtonLink = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

// eslint-disable-next-line react/jsx-props-no-spreading
const ButtonLink: FC<TButtonLink> = (props) => <Link as="button" {...props} />;

export default ButtonLink;
