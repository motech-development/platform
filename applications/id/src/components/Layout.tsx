import { BaseStyles } from '@motech-development/breeze-ui';
import React, { FC, memo, ReactNode } from 'react';
import Window from './Window';

export interface ILayoutProps {
  children: ReactNode;
}

const Layout: FC<ILayoutProps> = ({ children }) => (
  <>
    <BaseStyles />

    <Window>
      <>{children}</>
    </Window>
  </>
);

export default memo(Layout);
