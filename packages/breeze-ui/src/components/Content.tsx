import { FC, ReactNode } from 'react';

export interface IContentProps {
  children: ReactNode;
}

const Content: FC<IContentProps> = ({ children }) => (
  <section>{children}</section>
);

export default Content;
