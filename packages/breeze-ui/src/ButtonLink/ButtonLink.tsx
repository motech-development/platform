import { FC, ButtonHTMLAttributes, memo } from 'react';
import BaseLink from '../BaseLink/BaseLink';

const ButtonLink: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BaseLink as="button" {...props} />
);

export default memo(ButtonLink);
