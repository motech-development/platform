import { FC, ReactNode } from 'react';

export interface IWindowProps {
  children: ReactNode;
}

const Window: FC<IWindowProps> = ({ children }) => (
  <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">{children}</div>
  </div>
);

export default Window;
