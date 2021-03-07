import { FC, memo } from 'react';
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import BaseLink from '../BaseLink/BaseLink';

const Link: FC<LinkProps> = (props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <BaseLink as={RouterLink} {...props} />
);

export default memo(Link);
