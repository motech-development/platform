import { FC } from 'react';

export interface ILinkProps {
  to: string;
}

const Link: FC<ILinkProps> = ({ to }) => (
  <button
    type="button"
    onClick={() => {
      window.location.href = to;
    }}
  >
    Test
  </button>
);

export default Link;
